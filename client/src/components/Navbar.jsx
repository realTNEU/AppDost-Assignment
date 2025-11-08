import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const API_BASE = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5000/api', [])
  const navigate = useNavigate()

  const [navToggle, flipNav] = useState(false)
  const [profileMenu, toggleProfileMenu] = useState(false)
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const menuIcon = navToggle ? '✕' : '☰'

  useEffect(() => {
    let ignore = false

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          credentials: 'include',
        })

        if (!res.ok) {
          if (!ignore) setUser(null)
          return
        }

        const data = await res.json()
        if (!ignore) setUser(data.user)
      } catch (err) {
        if (!ignore) setUser(null)
      } finally {
        if (!ignore) setLoadingUser(false)
      }
    }

    fetchUser()
    return () => {
      ignore = true
    }
  }, [API_BASE])

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) return

      setUser(null)
      toggleProfileMenu(false)
      navigate('/auth')
    } catch (err) {
      console.error('Logout error', err)
    }
  }, [API_BASE, navigate])

  const defaultAvatar = useCallback((seed) => `https://api.dicebear.com/8.x/avataaars/svg?seed=${seed || 'user'}`, [])
  const loggedIn = !!user

  const closeMobileMenu = useCallback(() => flipNav(false), [])
  const closeMenus = useCallback(() => {
    toggleProfileMenu(false)
    closeMobileMenu()
  }, [closeMobileMenu])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenu && !event.target.closest('.profile-menu-container')) {
        toggleProfileMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [profileMenu])

  return (
    <nav className="fixed inset-x-0 top-3 sm:top-6 z-50 flex justify-center px-3 sm:px-4 font-inter">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex w-full max-w-6xl items-center justify-between rounded-2xl sm:rounded-3xl border border-purple-900/30 bg-[#120324]/40 px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-saturate-180"
      >
        <Link
          to="/"
          className="text-lg sm:text-2xl font-poppins font-semibold tracking-wide bg-linear-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent transition-opacity duration-200 hover:opacity-90"
        >
          PublicFeed
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
          <Link to="/" className="transition hover:text-fuchsia-300">
            Home
          </Link>
          <Link to="/feed" className="transition hover:text-fuchsia-300">
            Feed
          </Link>
          {loggedIn && (
            <>
              <Link to="/profile" className="transition hover:text-fuchsia-300">
                Profile
              </Link>
              <Link
                to="/feed"
                onClick={(e) => {
                  // Navigate to feed first, then open browse users
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('openBrowseUsers'));
                  }, 100);
                }}
                className="transition hover:text-fuchsia-300"
              >
                Browse Users
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-fuchsia-300 text-2xl focus:outline-none transition-transform hover:scale-110"
          onClick={() => flipNav(!navToggle)}
          aria-label="Toggle menu"
        >
          {menuIcon}
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {!loadingUser && (
            loggedIn ? (
              <div className="relative profile-menu-container">
                <button
                  onClick={() => toggleProfileMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-2xl border border-purple-800/40 bg-[#1b0430]/60 px-3 py-1.5 text-sm text-gray-200 transition hover:border-fuchsia-400/50 hover:text-fuchsia-200 hover:bg-[#1b0430]/80"
                >
                  <img
                    src={user?.avatarUrl || defaultAvatar(user?.firstName)}
                    alt="profile"
                    className="h-9 w-9 rounded-full border border-purple-900/40 object-cover"
                    loading="lazy"
                  />
                  <span className="max-w-[80px] sm:max-w-[100px] truncate text-xs sm:text-sm">{user?.firstName || 'Profile'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${profileMenu ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {profileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 rounded-2xl border border-purple-900/20 bg-[#120324]/95 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-180"
                    >
                      <Link
                        to="/profile"
                        className="block rounded-xl px-3 py-2 text-sm text-gray-300 transition hover:bg-fuchsia-500/10 hover:text-fuchsia-200"
                        onClick={closeMenus}
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="rounded-2xl bg-linear-to-r from-purple-600 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(168,85,247,0.25)] transition hover:shadow-[0_12px_40px_rgba(244,114,208,0.3)] hover:scale-105"
              >
                Login / Signup
              </Link>
            )
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {navToggle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-16 sm:top-20 mx-3 sm:mx-6 rounded-2xl sm:rounded-3xl border border-purple-900/20 bg-[#120324]/95 p-4 sm:p-6 text-sm text-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-180 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <Link to="/" className="transition hover:text-fuchsia-300" onClick={closeMobileMenu}>
                Home
              </Link>
              <Link to="/feed" className="transition hover:text-fuchsia-300" onClick={closeMobileMenu}>
                Feed
              </Link>
              {loggedIn ? (
                <>
                  <Link to="/profile" className="transition hover:text-fuchsia-300" onClick={closeMobileMenu}>
                    View Profile
                  </Link>
                  <Link
                    to="/feed"
                    onClick={(e) => {
                      closeMobileMenu();
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('openBrowseUsers'));
                      }, 100);
                    }}
                    className="transition hover:text-fuchsia-300"
                  >
                    Browse Users
                  </Link>
                  <button
                    onClick={() => {
                      closeMobileMenu()
                      handleLogout()
                    }}
                    className="text-left transition hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" className="transition hover:text-fuchsia-300" onClick={closeMobileMenu}>
                  Login / Signup
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
