// AI-Based Data Populator for AppDost
// Creates random users and generates AI-driven conversations about current tech events

import '../server/config/env.js';
import connectDB from '../server/utils/connectDB.js';
import User from '../server/models/User.js';
import { Groq } from 'groq-sdk';
import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is not set in environment variables');
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

// Groq model to use (from Groq API documentation)
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

// Test Groq API connection
async function testGroqAPI() {
  try {
    console.log('🔍 Testing Groq API connection...');
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'user',
          content: 'Say "Hello" if you can read this.',
        },
      ],
      max_tokens: 10,
    });
    
    const response = completion.choices[0]?.message?.content?.trim();
    if (response) {
      console.log('✅ Groq API connection successful!\n');
      return true;
    } else {
      console.error('❌ Groq API returned empty response');
      return false;
    }
  } catch (error) {
    console.error('❌ Groq API test failed:', error.message);
    if (error.status === 401 || error.statusCode === 401) {
      console.error('   ⚠️  Invalid API key. Please check your GROQ_API_KEY in the server/.env file.');
      console.error('   💡 Make sure your API key starts with "gsk_" and is valid.');
    } else if (error.message?.includes('model')) {
      console.error('   ⚠️  Model not found. Please check if the model name is correct.');
    }
    return false;
  }
}

// Random first names
const firstNames = [
  'Alex', 'Jordan', 'Morgan', 'Taylor', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Cameron', 'Dakota', 'Sage', 'River', 'Phoenix', 'Skylar', 'Blake', 'Finley',
  'Rowan', 'Hayden', 'Reese', 'Emery', 'Parker', 'Drew', 'Jamie', 'Dakota',
  'Logan', 'Avery', 'Cameron', 'Morgan', 'Jordan', 'Taylor', 'Casey', 'Riley'
];

// Random last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez',
  'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King'
];

// Random bio templates
const bioTemplates = [
  'Tech enthusiast passionate about innovation',
  'Software developer exploring new technologies',
  'AI researcher and machine learning practitioner',
  'Full-stack developer building the future',
  'Cybersecurity expert protecting digital spaces',
  'Cloud architect designing scalable solutions',
  'Data scientist uncovering insights',
  'UI/UX designer creating beautiful experiences',
  'DevOps engineer automating everything',
  'Blockchain developer building decentralized apps'
];

// Generate random user data
function generateRandomUser(index) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  // Create unique email with timestamp and index
  const timestamp = Date.now();
  const email = `ai.user${index}.${timestamp}@appdost.ai`.toLowerCase();
  const password = 'Password123!'; // Simple password for all AI users
  const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
  
  return { firstName, lastName, email, password, bio };
}

// Create user directly in database (with isVerified=true)
async function createUser(userData) {
  try {
    const user = new User({
      ...userData,
      isVerified: true,
      avatarUrl: '',
    });
    await user.save();
    console.log(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`);
    return user;
  } catch (error) {
    if (error.code === 11000) {
      // User already exists, try to find and return it
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`ℹ️  User already exists: ${userData.email}`);
        return existingUser;
      }
    }
    throw error;
  }
}

// Login user via API and get token
async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data.token;
  } catch (error) {
    console.error(`❌ Login failed for ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Create post via API
async function createPost(token, text, image = null) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/posts`,
      { text, image },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.post;
  } catch (error) {
    console.error('❌ Post creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Add comment via API
async function addComment(token, postId, text) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/posts/${postId}/comments`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.post;
  } catch (error) {
    console.error('❌ Comment creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Get current tech topics using Groq
async function getCurrentTechTopics() {
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a tech news expert. Provide a JSON object with a "topics" array containing 7-10 current technology topics, trends, or events happening right now.',
        },
        {
          role: 'user',
          content: 'List 7-10 current technology topics, trends, or events happening right now. Return a JSON object with a "topics" array like {"topics": ["topic1", "topic2", ...]}',
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    
    // Handle different response formats
    if (parsed.topics && Array.isArray(parsed.topics) && parsed.topics.length > 0) {
      return parsed.topics;
    } else {
      // Fallback topics
      return [
        'AI and Machine Learning advancements',
        'Web3 and Blockchain technology',
        'Cloud computing trends',
        'Cybersecurity threats',
        'Quantum computing progress',
        'Augmented Reality applications',
        'Sustainable technology',
        'Edge computing innovation',
        '5G and IoT expansion',
        'DevOps automation tools',
      ];
    }
  } catch (error) {
    console.error('❌ Failed to get tech topics:', error.message);
    // Return fallback topics
    return [
      'AI and Machine Learning advancements',
      'Web3 and Blockchain technology',
      'Cloud computing trends',
      'Cybersecurity threats',
      'Quantum computing progress',
      'Augmented Reality applications',
      'Sustainable technology',
      'Edge computing innovation',
    ];
  }
}

// Generate a post about a tech topic using Groq
async function generatePost(userName, techTopic) {
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are ${userName}, a tech enthusiast sharing thoughts on social media. Write a brief, engaging post (2-4 sentences) about the given technology topic. Be conversational, authentic, and natural. Don't use markdown formatting.`,
        },
        {
          role: 'user',
          content: `Write a social media post about: ${techTopic}. Keep it brief (2-4 sentences), engaging, and conversational. No markdown, just plain text.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    let postText = completion.choices[0]?.message?.content?.trim() || `Interesting developments in ${techTopic}!`;
    // Remove markdown if present
    postText = postText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();
    return postText;
  } catch (error) {
    console.error('❌ Failed to generate post:', error.message);
    return `Just read about ${techTopic}. Fascinating stuff! 🚀`;
  }
}

// Generate a comment on a post using Groq
async function generateComment(userName, postText, postAuthor) {
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are ${userName}, engaging in a conversation on social media. Write a brief, natural comment (1-2 sentences) responding to the post. Be conversational, maybe add your perspective, ask a question, or share related thoughts. No markdown formatting.`,
        },
        {
          role: 'user',
          content: `Write a comment on this post by ${postAuthor}: "${postText}". Keep it brief (1-2 sentences) and conversational. No markdown, just plain text.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 150,
    });

    let commentText = completion.choices[0]?.message?.content?.trim() || 'Great point! 👍';
    // Remove markdown if present
    commentText = commentText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();
    return commentText;
  } catch (error) {
    console.error('❌ Failed to generate comment:', error.message);
    return 'Interesting perspective! 🤔';
  }
}

// Sleep utility
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main function
async function runAIPopulator() {
  try {
    console.log('🚀 Starting AI Data Populator...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Test Groq API connection
    const apiTestPassed = await testGroqAPI();
    if (!apiTestPassed) {
      console.error('❌ Groq API test failed. Please check your API key and try again.');
      process.exit(1);
    }

    // Step 1: Create 10 random users
    console.log('📝 Step 1: Creating 10 random users...');
    const users = [];
    for (let i = 0; i < 10; i++) {
      const userData = generateRandomUser(i);
      try {
        const user = await createUser(userData);
        users.push({ ...user.toObject(), password: userData.password });
        await sleep(500); // Small delay between user creations
      } catch (error) {
        console.error(`❌ Failed to create user ${i + 1}:`, error.message);
      }
    }
    console.log(`✅ Created ${users.length} users\n`);

    // Step 2: Login all users and get tokens
    console.log('🔐 Step 2: Logging in users...');
    const userTokens = [];
    for (const user of users) {
      try {
        const token = await loginUser(user.email, user.password);
        userTokens.push({
          userId: user._id.toString(),
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
        });
        console.log(`✅ Logged in: ${user.firstName} ${user.lastName}`);
        await sleep(300);
      } catch (error) {
        console.error(`❌ Failed to login ${user.email}`);
      }
    }
    console.log(`✅ Logged in ${userTokens.length} users\n`);

    if (userTokens.length === 0) {
      console.error('❌ No users could be logged in. Exiting.');
      process.exit(1);
    }

    // Step 3: Get current tech topics
    console.log('🤖 Step 3: Fetching current tech topics from AI...');
    const techTopics = await getCurrentTechTopics();
    console.log(`✅ Got ${techTopics.length} tech topics:`, techTopics.join(', '));
    console.log('');

    // Step 4: Each user creates a post about a random tech topic
    console.log('📱 Step 4: Creating posts...');
    const posts = [];
    for (let i = 0; i < userTokens.length; i++) {
      const user = userTokens[i];
      const topic = techTopics[i % techTopics.length]; // Cycle through topics
      
      console.log(`🤖 Generating post for ${user.fullName} about: ${topic}`);
      const postText = await generatePost(user.fullName, topic);
      console.log(`   Post: "${postText.substring(0, 80)}..."`);
      
      try {
        const post = await createPost(user.token, postText);
        posts.push({
          ...post,
          authorToken: user.token,
          authorName: user.fullName,
        });
        console.log(`✅ Post created by ${user.fullName}\n`);
        await sleep(1000); // Delay between posts
      } catch (error) {
        console.error(`❌ Failed to create post for ${user.fullName}\n`);
      }
    }
    console.log(`✅ Created ${posts.length} posts\n`);

    // Step 5: Create conversations - users comment on each other's posts
    console.log('💬 Step 5: Generating conversations (comments)...');
    let commentCount = 0;
    
    if (posts.length === 0) {
      console.log('⚠️  No posts available for comments\n');
    } else {
      // Use the posts we just created, ensuring we have post IDs
      const postsWithIds = posts.filter(p => p._id || p.id);
      
      // Each user comments on 2-3 random posts from other users
      for (const user of userTokens) {
        // Get posts from other users
        const otherPosts = postsWithIds.filter(p => p.authorName !== user.fullName);
        
        if (otherPosts.length === 0) continue;

        // Randomly select 2-3 posts to comment on
        const postsToCommentOn = otherPosts
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(3, otherPosts.length));

        for (const post of postsToCommentOn) {
          try {
            console.log(`🤖 Generating comment from ${user.fullName} on ${post.authorName}'s post...`);
            const commentText = await generateComment(
              user.fullName,
              post.text,
              post.authorName
            );
            console.log(`   Comment: "${commentText.substring(0, 60)}..."`);
            
            const postId = post._id || post.id;
            if (!postId) {
              console.error(`   ⚠️  Post missing ID, skipping...\n`);
              continue;
            }
            
            await addComment(user.token, postId, commentText);
            commentCount++;
            console.log(`✅ Comment added\n`);
            await sleep(800); // Delay between comments
          } catch (error) {
            console.error(`❌ Failed to add comment from ${user.fullName}:`, error.response?.data?.message || error.message);
            console.log('');
          }
        }
      }
    }
    console.log(`✅ Added ${commentCount} comments\n`);

    console.log('🎉 AI Data Population completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users created: ${users.length}`);
    console.log(`   - Posts created: ${posts.length}`);
    console.log(`   - Comments added: ${commentCount}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error in AI populator:', error);
    process.exit(1);
  }
}

// Run the populator
runAIPopulator();

