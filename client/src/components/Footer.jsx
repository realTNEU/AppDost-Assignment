export default function Footer() {
  return (
    <footer className="relative border-t border-purple-900/40 bg-[#090114]/80 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 -top-12 flex justify-center">
        <div className="h-24 w-24 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-3 px-6 py-10">
        <div className="text-2xl font-poppins font-semibold tracking-wide bg-linear-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
          PublicFeed
        </div>
        <p className="text-sm text-gray-400 text-center max-w-md">
          A simple social media platform for sharing posts and connecting with others.
        </p>
      </div>
    </footer>
  );
}



