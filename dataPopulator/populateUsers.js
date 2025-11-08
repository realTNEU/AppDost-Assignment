// IMPORTANT: Load environment variables FIRST
import '../server/config/env.js';
import connectDB from '../server/utils/connectDB.js';
import User from '../server/models/User.js';

const dummyUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    isVerified: true,
    bio: "Software developer passionate about creating amazing web applications. Love coding and coffee! ☕",
    avatarUrl: ""
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "password123",
    isVerified: true,
    bio: "Full-stack developer and tech enthusiast. Always learning something new! 🚀",
    avatarUrl: ""
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    password: "password123",
    isVerified: true,
    bio: "UI/UX Designer turning ideas into beautiful interfaces. Design is my passion! 🎨",
    avatarUrl: ""
  },
  {
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@example.com",
    password: "password123",
    isVerified: true,
    bio: "Data scientist exploring the world of AI and machine learning. Numbers tell stories! 📊",
    avatarUrl: ""
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    password: "password123",
    isVerified: true,
    bio: "Backend engineer building scalable systems. Performance matters! ⚡",
    avatarUrl: ""
  },
  {
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@example.com",
    password: "password123",
    isVerified: true,
    bio: "Frontend developer crafting delightful user experiences. React is life! ⚛️",
    avatarUrl: ""
  },
  {
    firstName: "Robert",
    lastName: "Miller",
    email: "robert.miller@example.com",
    password: "password123",
    isVerified: true,
    bio: "DevOps engineer automating everything. Infrastructure as code! 🔧",
    avatarUrl: ""
  },
  {
    firstName: "Lisa",
    lastName: "Wilson",
    email: "lisa.wilson@example.com",
    password: "password123",
    isVerified: true,
    bio: "Mobile app developer creating apps for iOS and Android. Native is the way! 📱",
    avatarUrl: ""
  },
  {
    firstName: "James",
    lastName: "Moore",
    email: "james.moore@example.com",
    password: "password123",
    isVerified: true,
    bio: "Cybersecurity expert protecting digital assets. Security first! 🔒",
    avatarUrl: ""
  },
  {
    firstName: "Jessica",
    lastName: "Taylor",
    email: "jessica.taylor@example.com",
    password: "password123",
    isVerified: true,
    bio: "Product manager bridging the gap between users and developers. User-centric approach! 💡",
    avatarUrl: ""
  },
  {
    firstName: "William",
    lastName: "Anderson",
    email: "william.anderson@example.com",
    password: "password123",
    isVerified: true,
    bio: "Cloud architect designing scalable cloud solutions. AWS certified! ☁️",
    avatarUrl: ""
  },
  {
    firstName: "Amanda",
    lastName: "Thomas",
    email: "amanda.thomas@example.com",
    password: "password123",
    isVerified: true,
    bio: "QA engineer ensuring quality in every release. Bugs are my nemesis! 🐛",
    avatarUrl: ""
  },
  {
    firstName: "Christopher",
    lastName: "Jackson",
    email: "christopher.jackson@example.com",
    password: "password123",
    isVerified: true,
    bio: "Blockchain developer building decentralized applications. Web3 is the future! ⛓️",
    avatarUrl: ""
  },
  {
    firstName: "Ashley",
    lastName: "White",
    email: "ashley.white@example.com",
    password: "password123",
    isVerified: true,
    bio: "Content creator and tech blogger sharing knowledge with the community. Writing is my superpower! ✍️",
    avatarUrl: ""
  },
  {
    firstName: "Matthew",
    lastName: "Harris",
    email: "matthew.harris@example.com",
    password: "password123",
    isVerified: true,
    bio: "Game developer creating immersive gaming experiences. Level up! 🎮",
    avatarUrl: ""
  },
  {
    firstName: "Nicole",
    lastName: "Martin",
    email: "nicole.martin@example.com",
    password: "password123",
    isVerified: true,
    bio: "AI researcher exploring the frontiers of artificial intelligence. The future is here! 🤖",
    avatarUrl: ""
  },
  {
    firstName: "Daniel",
    lastName: "Thompson",
    email: "daniel.thompson@example.com",
    password: "password123",
    isVerified: true,
    bio: "Systems administrator keeping everything running smoothly. Uptime is key! 🖥️",
    avatarUrl: ""
  },
  {
    firstName: "Michelle",
    lastName: "Garcia",
    email: "michelle.garcia@example.com",
    password: "password123",
    isVerified: true,
    bio: "Technical writer making complex concepts accessible. Clarity matters! 📝",
    avatarUrl: ""
  },
  {
    firstName: "Andrew",
    lastName: "Martinez",
    email: "andrew.martinez@example.com",
    password: "password123",
    isVerified: true,
    bio: "Database administrator optimizing queries and maintaining data integrity. Data is power! 💾",
    avatarUrl: ""
  },
  {
    firstName: "Stephanie",
    lastName: "Robinson",
    email: "stephanie.robinson@example.com",
    password: "password123",
    isVerified: true,
    bio: "Scrum master facilitating agile development. Collaboration drives success! 🏃",
    avatarUrl: ""
  }
];

async function populateUsers() {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing users (optional - comment out if you want to keep existing users)
    // const deleted = await User.deleteMany({});
    // console.log(`🗑️  Deleted ${deleted.deletedCount} existing users`);

    // Check for existing users to avoid duplicates
    const existingEmails = await User.find({ email: { $in: dummyUsers.map(u => u.email) } }).select('email');
    const existingEmailSet = new Set(existingEmails.map(u => u.email));
    
    const usersToInsert = dummyUsers.filter(user => !existingEmailSet.has(user.email));
    
    if (usersToInsert.length === 0) {
      console.log("ℹ️  All users already exist in the database");
      process.exit(0);
    }

    // Insert users
    // Note: The password will be automatically hashed by the pre-save hook in the User model
    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Successfully created ${createdUsers.length} verified users`);

    // Display created users
    console.log("\n📋 Created users:");
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Verified: ${user.isVerified}`);
    });

    console.log("\n✅ Database population completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error populating users:", error);
    process.exit(1);
  }
}

populateUsers();

