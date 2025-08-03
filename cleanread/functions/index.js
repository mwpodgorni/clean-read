const functions = require('firebase-functions');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const cors = require('cors')({ origin: true });

/**
 * Firebase Cloud Function to scrape and extract readable content from articles
 * Uses Mozilla Readability to extract clean, readable content from web pages
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.scrapeArticle = functions.https.onRequest((req, res) => {
    // Enable CORS for all origins
    cors(req, res, async () => {
        try {
            // Validate request method
            if (req.method !== 'GET') {
                return res.status(405).json({
                    error: 'Method not allowed. Only GET requests are supported.'
                });
            }

            // Extract URL from query parameters
            const { url } = req.query;

            // Validate URL parameter
            if (!url) {
                return res.status(400).json({
                    error: 'URL parameter is required. Please provide a valid URL.'
                });
            }

            // Validate URL format
            try {
                new URL(url);
            } catch (error) {
                return res.status(400).json({
                    error: 'Invalid URL format. Please provide a valid URL.'
                });
            }

            console.log(`Scraping article from: ${url}`);

            // Fetch the HTML content
            const response = await axios.get(url, {
                timeout: 30000, // 30 second timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                maxRedirects: 5,
                validateStatus: function (status) {
                    return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
                }
            });

            // Create a DOM object from the HTML content
            const dom = new JSDOM(response.data, {
                url: url,
                pretendToBeVisual: true,
                resources: 'usable'
            });

            // Extract readable content using Mozilla Readability
            const reader = new Readability(dom.window.document);
            const article = reader.parse();

            // Validate that we got meaningful content
            if (!article || !article.title || !article.content) {
                return res.status(422).json({
                    error: 'Could not extract readable content from this URL. The page might not contain an article or might be blocked from scraping.'
                });
            }

            // Clean up the content (remove any remaining script tags, etc.)
            const cleanContent = article.content
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

            // Prepare the response
            const result = {
                title: article.title.trim(),
                byline: article.byline ? article.byline.trim() : null,
                content: cleanContent,
                excerpt: article.excerpt ? article.excerpt.trim() : null,
                length: article.length || 0,
                siteName: article.siteName ? article.siteName.trim() : null,
                publishedTime: article.publishedTime || null,
                // Calculate reading time (average reading speed: 200 words per minute)
                readingTime: Math.ceil((cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length) / 200)
            };

            console.log(`Successfully extracted article: "${result.title}" (${result.readingTime} min read)`);

            // Return the extracted article data
            res.status(200).json(result);

        } catch (error) {
            console.error('Error scraping article:', error);

            // Handle specific error types
            if (error.code === 'ENOTFOUND') {
                return res.status(404).json({
                    error: 'URL not found. Please check the URL and try again.'
                });
            }

            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                return res.status(503).json({
                    error: 'Unable to connect to the website. The site might be down or blocking requests.'
                });
            }

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const status = error.response.status;
                if (status === 403) {
                    return res.status(403).json({
                        error: 'Access denied. This website blocks scraping requests.'
                    });
                } else if (status === 404) {
                    return res.status(404).json({
                        error: 'Page not found. The URL might be incorrect or the page has been removed.'
                    });
                } else if (status >= 500) {
                    return res.status(503).json({
                        error: 'The website is currently experiencing issues. Please try again later.'
                    });
                } else {
                    return res.status(status).json({
                        error: `HTTP error ${status}: ${error.response.statusText}`
                    });
                }
            }

            // Generic error response
            res.status(500).json({
                error: 'An unexpected error occurred while processing the article. Please try again.'
            });
        }
    });
});

/**
 * Health check endpoint
 */
exports.health = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'CleanRead Article Scraper'
        });
    });
}); 