import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function LandingPage() {
  // TODO: Update these with your actual URLs
  const RESUME_WEBSITE_URL = 'https://stillnotfoundameya.lol' // Replace with your website URL
  const RESUME_GITHUB_URL = 'https://github.com/realTNEU' // Replace with your GitHub URL
  const RESUME_URL = 'https://drive.google.com/file/d/1XKoxqvvp7o3tY4MQtyxui_nC6jTt1rUz/view?usp=sharing' // Replace with your resume URL (PDF or link)
  const AVATAR_URL = 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Robert' // Replace with your avatar URL

  return (
    <div className="font-inter text-gray-100">
      {/* Hero Section */}
      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-12 lg:flex-row lg:items-center lg:py-20">
        <div className="w-full lg:w-3/5">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-700/40 bg-[#1b0230]/60 px-3 py-1 sm:px-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-fuchsia-300 text-center"
          >
            Full Stack Developer <br className="sm:hidden" /> <span className="hidden sm:inline"> </span>Internship Assignment
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-poppins font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Simple Social <br className="hidden sm:block" /> Media Website
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base text-gray-300 sm:text-lg"
          >
            This is a test assignment showcasing my creativity and full-stack development skills. 
            A simple web app like LinkedIn where users can sign up, log in, create posts, and see 
            posts from all other users. Built with React.js, Node.js, Express.js, and MongoDB.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-purple-600 to-fuchsia-500 px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_35px_rgba(168,85,247,0.28)] transition hover:shadow-[0_12px_45px_rgba(244,114,208,0.35)]"
            >
              Sign Up / Login
            </Link>
            <Link
              to="/feed"
              className="inline-flex items-center justify-center rounded-2xl border border-purple-700/40 px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-semibold text-fuchsia-200 transition hover:border-fuchsia-400 hover:text-white"
            >
              View Feed
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative w-full lg:w-2/5"
        >
          <div className="pointer-events-none absolute -top-10 -right-6 h-36 w-36 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-purple-500/30 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#140322]/80 p-6 shadow-[0_30px_80px_rgba(8,0,24,0.55)] backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
              <span className="rounded-full bg-[#2c0440] px-2 sm:px-3 py-1 text-fuchsia-200 text-[10px] sm:text-xs">How It Works</span>
              <span className="text-[10px] sm:text-xs">Simple & Intuitive</span>
            </div>
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-purple-900/40 bg-[#19042c]/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold">1</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-purple-200">Sign Up / Login</div>
                    <div className="mt-1 text-xs text-gray-400">Register with email and password to get started</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-purple-900/40 bg-[#19042c]/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">2</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-purple-200">Create Posts</div>
                    <div className="mt-1 text-xs text-gray-400">Write and share your thoughts with text and images</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-purple-900/40 bg-[#19042c]/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">3</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-purple-200">View All Posts</div>
                    <div className="mt-1 text-xs text-gray-400">See posts from all users in a public feed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative border-y border-purple-900/30 bg-[#10011b]/70 py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
          <div className="flex flex-col gap-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-purple-300">
              Core Features
            </span>
            <h2 className="text-3xl font-poppins font-semibold text-white md:text-4xl">
              Built as Per Assignment Requirements
            </h2>
            <p className="max-w-3xl mx-auto text-sm text-gray-400 md:text-base">
              All required features implemented with bonus enhancements for a better user experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#160226]/60 p-7 shadow-[0_30px_70px_rgba(8,0,24,0.4)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40"
            >
              <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-fuchsia-500/15 blur-3xl transition duration-300 group-hover:blur-2xl" />
              <div className="text-2xl mb-3">🔐</div>
              <div className="text-sm font-semibold text-purple-200">User Login & Signup</div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Users can register with email and password. After registration, log in to use the website. 
                User's name and profile are displayed on the top bar once logged in.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#160226]/60 p-7 shadow-[0_30px_70px_rgba(8,0,24,0.4)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40"
            >
              <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-purple-500/15 blur-3xl transition duration-300 group-hover:blur-2xl" />
              <div className="text-2xl mb-3">📝</div>
              <div className="text-sm font-semibold text-purple-200">Create Post</div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                After login, users can write posts with text content. Each post displays the user's name, 
                post text, and the time when it was created. Users can also upload images with posts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#160226]/60 p-7 shadow-[0_30px_70px_rgba(8,0,24,0.4)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40"
            >
              <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl transition duration-300 group-hover:blur-2xl" />
              <div className="text-2xl mb-3">👁️</div>
              <div className="text-sm font-semibold text-purple-200">View All Posts</div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                All users can see posts made by every registered user in a public feed. Posts are displayed 
                with the latest posts first for easy browsing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#160226]/60 p-7 shadow-[0_30px_70px_rgba(8,0,24,0.4)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40"
            >
              <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-green-500/15 blur-3xl transition duration-300 group-hover:blur-2xl" />
              <div className="text-2xl mb-3">👍</div>
              <div className="text-sm font-semibold text-purple-200">Like & Comment</div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Users can like, dislike, and comment on posts. Engage with the community through 
                meaningful interactions with real-time updates.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#160226]/60 p-7 shadow-[0_30px_70px_rgba(8,0,24,0.4)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40"
            >
              <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-yellow-500/15 blur-3xl transition duration-300 group-hover:blur-2xl" />
              <div className="text-2xl mb-3">✏️</div>
              <div className="text-sm font-semibold text-purple-200">Edit & Delete Posts</div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Users can edit or delete their own posts. Full control over your content with 
                an intuitive interface for post management.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#160226]/60 p-7 shadow-[0_30px_70px_rgba(8,0,24,0.4)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/40"
            >
              <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-pink-500/15 blur-3xl transition duration-300 group-hover:blur-2xl" />
              <div className="text-2xl mb-3">👤</div>
              <div className="text-sm font-semibold text-purple-200">Profile Page</div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Each user has a simple profile page where they can view and edit their information, 
                see all their posts, and manage their account settings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-10 px-4 sm:px-6 py-12 sm:py-20">
        <div className="relative flex-1 overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-900/40 bg-[#140321]/80 p-4 sm:p-6 md:p-8 shadow-[0_35px_90px_rgba(8,0,24,0.55)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#441c7a_0%,transparent_55%)] opacity-40" />
          <div className="relative flex flex-col gap-5 text-sm text-gray-200">
            <div className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] text-purple-300 break-words">Technology Stack</div>
            <h3 className="text-2xl font-poppins font-semibold text-white">
              Built with Modern Technologies
            </h3>
            <p className="text-sm text-gray-300">
              This project demonstrates full-stack development skills using industry-standard technologies 
              as specified in the assignment requirements.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <div className="rounded-2xl border border-purple-900/40 bg-[#19042c]/60 p-4">
                <div className="text-sm font-semibold text-purple-200 mb-2">Frontend</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">React.js - Modern UI library for building interactive interfaces</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">React Router - Navigation and routing</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">Framer Motion - Smooth animations and transitions</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">Tailwind CSS - Utility-first styling</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-purple-900/40 bg-[#19042c]/60 p-4">
                <div className="text-sm font-semibold text-purple-200 mb-2">Backend & Database</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">Node.js - JavaScript runtime environment</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">Express.js - Web application framework</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">MongoDB - NoSQL database for data storage</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">Cloudinary - Cloud-based image storage and optimization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section - Above Footer */}
      <section className="relative border-t border-purple-900/30 bg-[#0b0114]/80 py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 blur-2xl" />
            <img
              src={AVATAR_URL}
              alt="Developer Avatar"
              className="relative h-32 w-32 rounded-full border-4 border-purple-700/50 object-cover shadow-[0_8px_32px_rgba(168,85,247,0.4)]"
            />
          </motion.div>
          <span className="text-xs font-semibold uppercase tracking-[0.5em] text-purple-300">
            View My Work
          </span>
          <h3 className="text-3xl font-poppins font-semibold text-white md:text-4xl">
            Check Out My Portfolio
          </h3>
          <p className="max-w-3xl text-sm text-gray-400 md:text-base">
            Explore my other projects, contributions, and professional experience
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <motion.a
              href={RESUME_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-6 py-2.5 sm:px-10 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_35px_rgba(168,85,247,0.28)] transition hover:shadow-[0_12px_45px_rgba(244,114,208,0.32)] text-center"
            >
              Visit My Website
            </motion.a>
            <motion.a
              href={RESUME_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl border border-fuchsia-400/40 px-6 py-2.5 sm:px-10 sm:py-3 text-xs sm:text-sm font-semibold text-fuchsia-200 transition hover:border-fuchsia-300 hover:text-white text-center"
            >
              View on GitHub
            </motion.a>
            <motion.a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl border border-purple-400/40 bg-purple-500/10 px-6 py-2.5 sm:px-10 sm:py-3 text-xs sm:text-sm font-semibold text-purple-200 transition hover:border-purple-300 hover:bg-purple-500/20 hover:text-white text-center"
            >
              View My Resume
            </motion.a>
          </div>
        </div>
      </section>

    </div>
  )
}
