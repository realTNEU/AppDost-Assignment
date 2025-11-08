# AI Data Populator for AppDost

An AI-powered data populator that creates random users and generates realistic conversations about current technology topics using the Groq API.

## Features

- Creates 10 random users with unique profiles
- Generates posts about current technology trends using AI
- Creates natural conversations through comments between users
- Uses Groq API for intelligent content generation
- Interacts with the live backend API

## Prerequisites

1. **Groq API Key**: Get your API key from [Groq Console](https://console.groq.com/)
   - Your API key should start with `gsk_`
   - The script uses the model: `meta-llama/llama-4-scout-17b-16e-instruct`
2. **Running Backend**: Make sure your server is running on `http://localhost:5000` (or set `API_BASE_URL`)
3. **Environment Variables**: Ensure your `.env` file in the `server` directory has:
   - `MONGO_URI`: MongoDB connection string
   - `GROQ_API_KEY`: Your Groq API key (starts with `gsk_`)
   - `JWT_SECRET`: JWT secret for authentication
   - `API_BASE_URL` (optional): Defaults to `http://localhost:5000/api`

**⚠️ Important**: Never commit your API key to version control. Always use environment variables.

## Installation

1. Navigate to the `dataPopulator` directory:
   ```bash
   cd dataPopulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Make sure your backend server is running:
   ```bash
   cd ../server
   npm run dev
   ```

2. Run the AI populator:
   ```bash
   npm run populate
   ```

   Or directly:
   ```bash
   node aiPopulator.js
   ```

## How It Works

1. **API Test**: Tests the Groq API connection before proceeding (validates API key)
2. **User Creation**: Creates 10 random users directly in the database with `isVerified=true`
3. **Authentication**: Logs in each user via the API to obtain authentication tokens
4. **Topic Generation**: Uses Groq AI (`meta-llama/llama-4-scout-17b-16e-instruct`) to fetch current technology topics and trends
5. **Post Generation**: Each user creates a post about a random tech topic using AI-generated content
6. **Conversations**: Users comment on each other's posts, creating natural conversation threads

## Generated Content

- **Users**: Random names, emails, and bios
- **Posts**: AI-generated posts about current tech topics (AI, Web3, Cloud Computing, Cybersecurity, etc.)
- **Comments**: Natural, conversational comments that respond to posts

## Notes

- All AI users use the password: `Password123!`
- User emails follow the pattern: `ai.user{N}.{timestamp}@appdost.ai`
- The script includes delays between API calls to avoid rate limiting
- If a user already exists, it will skip creation and continue
- The script fetches current tech topics from Groq AI, with fallback topics if the API fails

## Environment Variables

Add to your `server/.env` file (or root `.env` file):

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
API_BASE_URL=http://localhost:5000/api  # Optional, defaults to http://localhost:5000/api
```

**Important**: The script reads environment variables from the `server/.env` file, so make sure your `GROQ_API_KEY` is set there.

## Troubleshooting

- **GROQ_API_KEY not set**: Make sure you've added your Groq API key to the `server/.env` file
- **Connection errors**: Ensure your backend server is running on port 5000 (or update `API_BASE_URL`)
- **Authentication failures**: Check that users are being created with `isVerified=true` in the database
- **API rate limits**: The script includes delays, but if you encounter rate limits, increase the sleep durations in the code
- **MongoDB connection errors**: Verify your `MONGO_URI` is correct in the `server/.env` file
- **Post/Comment creation fails**: Make sure the server is running and the API endpoints are accessible

## Example Output

```
🚀 Starting AI Data Populator...

✅ Connected to database

🔍 Testing Groq API connection...
✅ Groq API connection successful!

📝 Step 1: Creating 10 random users...
✅ Created user: Alex Smith (ai.user0.1234567890@appdost.ai)
...
✅ Created 10 users

🔐 Step 2: Logging in users...
✅ Logged in: Alex Smith
...
✅ Logged in 10 users

🤖 Step 3: Fetching current tech topics from AI...
✅ Got 8 tech topics: AI and Machine Learning, Web3 and Blockchain, ...

📱 Step 4: Creating posts...
🤖 Generating post for Alex Smith about: AI and Machine Learning
   Post: "The recent advancements in AI are truly groundbreaking..."
✅ Post created by Alex Smith
...

💬 Step 5: Generating conversations (comments)...
🤖 Generating comment from Jordan Johnson on Alex Smith's post...
   Comment: "I completely agree! The potential is incredible..."
✅ Comment added
...

🎉 AI Data Population completed successfully!
📊 Summary:
   - Users created: 10
   - Posts created: 10
   - Comments added: 25
```

