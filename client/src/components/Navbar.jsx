import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [navToggle, flipNav] = useState(false)
  const vibe = navToggle ? '✕' : '☰'

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] lg:w-[70%] flex items-center justify-between px-8 py-3 rounded-2xl border border-purple-900/40 bg-[#1a0b2e]/40 backdrop-blur-lg shadow-[0_0_25px_rgba(155,66,255,0.2)] z-50 font-inter select-none">
      <Link
        to="/"
        className="text-2xl font-poppins font-semibold bg-linear-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent tracking-wide hover:opacity-90 transition-all duration-300"
      >
        AppDost
      </Link>

      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link to="/" className="text-gray-300 hover:text-fuchsia-400 transition duration-300 tracking-wide">
          Home
        </Link>
        <Link to="/auth" className="text-gray-300 hover:text-fuchsia-400 transition duration-300 tracking-wide">
          Login / Signup
        </Link>
      </div>

      <button
        className="md:hidden text-fuchsia-400 text-2xl focus:outline-none"
        onClick={() => flipNav(!navToggle)}
      >
        {vibe}
      </button>

      {navToggle && (
        <div className="absolute top-16 right-4 w-48 bg-[#1a0b2e]/90 border border-purple-800/40 rounded-2xl p-4 flex flex-col gap-3 shadow-lg backdrop-blur-md md:hidden font-inter animate-fadeIn">
          <Link to="/" className="text-gray-300 hover:text-fuchsia-400 transition duration-300 tracking-wide" onClick={() => flipNav(false)}>
            Home
          </Link>
          <Link to="/auth" className="text-gray-300 hover:text-fuchsia-400 transition duration-300 tracking-wide" onClick={() => flipNav(false)}>
            Login / Signup
          </Link>
        </div>
      )}
    </nav>
  )
}