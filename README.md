# PublicFeed - LinkedIn Clone

A modern social media platform built with React.js, Node.js, Express.js, and MongoDB. Users can sign up, log in, create posts, view a public feed, interact with posts through likes, dislikes, and comments, and manage their profiles.

## 🚀 Features

### Core Features (Required)
- **User Authentication**: Secure signup and login with email verification via OTP
- **Create Posts**: Users can create text posts and upload images
- **Public Feed**: View all posts from all users in a public feed with pagination
- **User Profile**: Each user has a profile page displaying their information and posts
- **Edit/Delete Posts**: Users can edit or delete their own posts
- **Like/Dislike**: Users can like or dislike posts
- **Comments**: Users can add comments to posts

### Bonus Features
- **Image Upload**: Upload images with posts using Cloudinary integration
- **Avatar Upload**: Custom avatar uploads for user profiles
- **Browse Users**: Browse and search for other users
- **User Profiles**: View other users' profiles and their posts
- **Responsive Design**: Fully responsive UI that works on all devices
- **Modern UI**: Beautiful, modern interface with animations using Framer Motion
- **Password Reset**: Password reset functionality via email

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation and routing
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud-based image storage and optimization
- **Nodemailer** - Email sending for OTP and password reset

### Security
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - MongoDB injection prevention
- **Cookie-based authentication** - Secure HTTP-only cookies

## 📁 Project Structure

```
AppDost/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Backend Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
├── dataPopulator/          # Data population scripts
│   ├── aiPopulator.js      # AI-powered data populator
│   └── populateUsers.js    # Simple user populator
└── README.md
```

## 🔧 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)
- Gmail account (for email sending)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd AppDost
```

### Step 2: Install Dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd server
npm install
```

#### Data Populator (Optional)
```bash
cd dataPopulator
npm install
```

### Step 3: Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/AppDost

# JWT Secret
JWT_SECRET=your-secret-key-here

# Server
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gmail (for email sending)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# Groq API (optional, for AI data populator)
GROQ_API_KEY=your-groq-api-key
API_BASE_URL=http://localhost:5000/api
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Run the Application

#### Start MongoDB
Make sure MongoDB is running on your system.

#### Start the Backend Server
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`

#### Start the Frontend
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/verify-otp` - Verify OTP for email verification
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile (Protected)
- `PUT /api/users/update-profile` - Update user profile (Protected)
- `GET /api/users` - Get all users (Optional Auth)
- `GET /api/users/:userId` - Get user by ID (Optional Auth)
- `POST /api/users/request-reset` - Request password reset
- `POST /api/users/reset-password` - Reset password

### Posts
- `POST /api/posts` - Create a new post (Protected)
- `GET /api/posts/feed` - Get public feed (Optional Auth)
- `GET /api/posts/user` - Get current user's posts (Protected)
- `GET /api/posts/user/:userId` - Get posts by user ID (Optional Auth)
- `PATCH /api/posts/:id` - Update a post (Protected)
- `DELETE /api/posts/:id` - Delete a post (Protected)
- `PATCH /api/posts/:id/like` - Like a post (Protected)
- `PATCH /api/posts/:id/dislike` - Dislike a post (Protected)
- `POST /api/posts/:id/comments` - Add a comment to a post (Protected)

## 🎯 Usage

### Sign Up
1. Navigate to the signup page
2. Enter your first name, last name, email, and password
3. Verify your email with the OTP sent to your email
4. You'll be automatically logged in after verification

### Create a Post
1. Log in to your account
2. Navigate to the Feed or Profile page
3. Write your post in the text area
4. Optionally upload an image
5. Click "Post" to publish

### Interact with Posts
- Click the 👍 button to like a post
- Click the 👎 button to dislike a post
- Type a comment in the comment box and click "Send"
- Click "Edit" to edit your own posts
- Click "Delete" to delete your own posts

### Browse Users
1. Click "Browse Users" in the navigation
2. Search for users by name
3. Click on a user to view their profile

## 🧪 Data Population

### Simple User Populator
Populate the database with dummy users:

```bash
cd dataPopulator
node populateUsers.js
```

This will create 20 verified users with dummy data.

### AI Data Populator
Populate the database with AI-generated content:

```bash
cd dataPopulator
npm run populate
```

This will:
1. Create 10 random users
2. Generate AI-powered posts about current tech topics
3. Create natural conversations through comments

**Note**: Requires Groq API key in the server `.env` file.

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to Vercel or Netlify
3. Set environment variable `VITE_API_URL` to your backend URL

### Backend Deployment (Render/Railway)
1. Push your code to GitHub
2. Connect your repository to Render or Railway
3. Set all environment variables
4. Deploy

### Environment Variables for Production
Make sure to set:
- `NODE_ENV=production`
- `CLIENT_URL` to your frontend URL
- `MONGO_URI` to your production MongoDB URI
- All other required environment variables

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- HTTP-only cookies for secure token storage
- CORS configuration
- Rate limiting
- MongoDB injection prevention
- Input sanitization
- Helmet.js for security headers

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI/UX Features

- Modern, dark theme with purple/fuchsia accents
- Smooth animations using Framer Motion
- Particle backdrop effects
- Responsive navigation bar
- Loading states and error handling
- Image optimization with Cloudinary
- Lazy loading for images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of a Full Stack Developer Internship Assignment.

## 👤 Author

Built as an assignment submission for AppDost.

## 📧 Contact

For questions or issues, please contact: hr@appdost.in

---

**Note**: This is a project assignment. Make sure to update all placeholder URLs, API keys, and personal information before deploying to production.

