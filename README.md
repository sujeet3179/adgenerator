# Ad Generator with ChatGPT Integration

A modern web application that allows users to generate attractive advertisements with AI-powered content generation using ChatGPT.

## Features

- Generate ad content using ChatGPT
- Upload and preview images
- Customize ad title and description
- Download generated ads as images
- Share ads on social media platforms

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- AI: OpenAI ChatGPT API
- Styling: CSS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser (typically at http://localhost:5173)
2. Use the "Generate with AI" section to create ad content by describing your product or service
3. Upload an image for your ad
4. Customize the title and description if needed
5. Download or share your ad

## Troubleshooting

If you encounter the "Failed to generate content" error:

1. Make sure your OpenAI API key is valid and properly set in the `.env` file
2. Check that the backend server is running on port 3001
3. Verify your internet connection
4. Check the browser console and server logs for more detailed error messages

## License

MIT
