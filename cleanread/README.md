# CleanRead

A clean, distraction-free article reader built with Angular, Tailwind CSS, and Firebase Cloud Functions. Transform any article URL into a beautiful reading experience by removing ads, navigation, and other distractions.

## Features

- **Clean Article Extraction**: Uses Mozilla Readability to extract clean content from any article URL
- **Responsive Design**: Beautiful, responsive UI built with Tailwind CSS
- **Dark/Light Mode**: Toggle between light and dark themes
- **Font Size Control**: Adjustable font size for comfortable reading
- **Reading Time**: Automatic calculation of estimated reading time
- **Error Handling**: User-friendly error messages for various failure scenarios
- **Loading States**: Smooth loading indicators during article processing

## Tech Stack

- **Frontend**: Angular 20 + Tailwind CSS
- **Backend**: Firebase Cloud Functions (Node.js)
- **Article Processing**: Mozilla Readability + jsdom + axios
- **Deployment**: Firebase Hosting + Firebase Functions

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install Angular dependencies
npm install

# Install Firebase function dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Project Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Cloud Functions and Hosting
3. Update `.firebaserc` with your project ID:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```

### 3. Configure Firebase Functions

1. Login to Firebase CLI:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select Functions and Hosting
   - Choose your project
   - Use JavaScript for Functions
   - Use public directory: `dist/cleanread/browser`

### 4. Update API URL

Update the API URL in `src/app/services/article.service.ts`:

```typescript
private readonly apiUrl = 'https://your-firebase-function-url.cloudfunctions.net/scrapeArticle';
```

You'll get this URL after deploying the functions.

## Development

### Start Development Server

```bash
# Start Angular development server
npm start

# In another terminal, start Firebase emulators (optional)
firebase emulators:start
```

The app will be available at `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## Deployment

### 1. Deploy Firebase Functions

```bash
cd functions
npm run deploy
```

This will give you the function URL to update in the Angular service.

### 2. Deploy Angular App

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### 3. Update API URL

After deploying functions, update the API URL in `src/app/services/article.service.ts` with the actual function URL from the deployment output.

### 4. Redeploy Frontend

```bash
npm run build
firebase deploy --only hosting
```

## Usage

1. Open the deployed application
2. Paste any article URL in the input field
3. Click the submit button or press Enter
4. Wait for the article to be processed
5. Enjoy reading in a clean, distraction-free environment
6. Use the reading controls to adjust font size and theme

## API Endpoints

### `GET /scrapeArticle`

Extracts readable content from a given URL.

**Query Parameters:**
- `url` (required): The URL of the article to scrape

**Response:**
```json
{
  "title": "Article Title",
  "byline": "Author Name",
  "content": "<div>Clean HTML content...</div>",
  "excerpt": "Article summary",
  "length": 1500,
  "siteName": "Website Name",
  "publishedTime": "2023-01-01T00:00:00Z",
  "readingTime": 8
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "service": "CleanRead Article Scraper"
}
```

## Project Structure

```
cleanread/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── url-input/          # URL input form component
│   │   │   └── reader-view/        # Article display component
│   │   ├── models/
│   │   │   └── article.interface.ts # Article data interface
│   │   ├── services/
│   │   │   └── article.service.ts  # HTTP service for API calls
│   │   └── app.component.*         # Main app component
│   ├── styles.css                  # Global styles with Tailwind
│   └── main.ts                     # App bootstrap
├── functions/
│   ├── index.js                    # Firebase Cloud Functions
│   └── package.json                # Function dependencies
├── firebase.json                   # Firebase configuration
├── .firebaserc                     # Firebase project config
├── tailwind.config.js              # Tailwind CSS configuration
└── package.json                    # Angular dependencies
```

## Customization

### Styling

The app uses Tailwind CSS for styling. You can customize:

- Colors and themes in `tailwind.config.js`
- Component styles in `src/styles.css`
- Individual component styles in their respective `.css` files

### Function Configuration

Modify the Firebase function in `functions/index.js` to:

- Change timeout settings
- Add more user agents
- Implement rate limiting
- Add authentication
- Customize error handling

## Troubleshooting

### Common Issues

1. **CORS Errors**: The function includes CORS headers, but some sites may still block requests
2. **Function Timeout**: Default timeout is 30 seconds. Increase if needed
3. **Content Extraction Fails**: Some sites may block scraping or have complex layouts
4. **Build Errors**: Ensure all dependencies are installed and Node.js version is correct

### Debugging

1. Check Firebase function logs:
   ```bash
   firebase functions:log
   ```

2. Test function locally:
   ```bash
   firebase emulators:start --only functions
   ```

3. Check browser console for frontend errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Mozilla Readability](https://github.com/mozilla/readability) for content extraction
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Firebase](https://firebase.google.com/) for hosting and functions
