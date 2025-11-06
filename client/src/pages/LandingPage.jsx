import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0a19] font-inter text-gray-200 overflow-hidden">
      <section className="flex flex-col items-center justify-center text-center px-8 py-32">
        <h1 className="text-5xl md:text-6xl font-poppins font-semibold bg-linear-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent leading-tight">
          Discover. Connect. Grow.
        </h1>
        <p className="text-gray-400 mt-6 max-w-2xl text-lg tracking-wide">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et elit eu massa congue egestas. Nulla facilisi. Sed vitae ipsum vel justo pulvinar tristique.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/browse"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          >
            Browse Anonymously
          </Link>
          <Link
            to="/auth"
            className="border border-purple-600 hover:bg-purple-800 text-purple-300 px-8 py-3 rounded-full font-medium transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-20 py-24 bg-[#150b25]/60 backdrop-blur-md border-t border-purple-900/40">
        <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-center mb-12 bg-linear-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
          What’s Happening on AppDost
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-[#1a0b2e]/60 border border-purple-800/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(155,66,255,0.15)] hover:shadow-[0_0_25px_rgba(155,66,255,0.25)] transition-all duration-300"
            >
              <div className="w-full h-40 bg-linear-to-tr from-purple-900/40 to-fuchsia-800/40 rounded-xl mb-4 flex items-center justify-center text-purple-300 text-sm">
                <span>placeholder image {item}</span>
              </div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Lorem Ipsum Dolor</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo, odio nec placerat dictum, purus leo consequat lorem.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}