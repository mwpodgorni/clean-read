/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: 'inherit',
                        a: {
                            color: 'inherit',
                            textDecoration: 'underline',
                        },
                        strong: {
                            color: 'inherit',
                        },
                        code: {
                            color: 'inherit',
                        },
                        h1: {
                            color: 'inherit',
                        },
                        h2: {
                            color: 'inherit',
                        },
                        h3: {
                            color: 'inherit',
                        },
                        h4: {
                            color: 'inherit',
                        },
                        blockquote: {
                            color: 'inherit',
                        },
                        hr: {
                            borderColor: 'inherit',
                        },
                        ol: {
                            color: 'inherit',
                        },
                        ul: {
                            color: 'inherit',
                        },
                        li: {
                            color: 'inherit',
                        },
                        table: {
                            color: 'inherit',
                        },
                        thead: {
                            color: 'inherit',
                        },
                        tbody: {
                            color: 'inherit',
                        },
                        tr: {
                            borderColor: 'inherit',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
    darkMode: 'class',
} 