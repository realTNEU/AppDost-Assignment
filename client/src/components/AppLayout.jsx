import ParticleBackdrop from "./ParticleBackdrop";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#06010c] text-gray-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1c0640_0%,#080010_55%,#040008_100%)] opacity-95" />
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-700/25 blur-3xl" />
        <div className="absolute -bottom-48 right-[-10%] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-3xl" />
      </div>
      <ParticleBackdrop />

      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">{children}</main>
        <Footer />
      </div>
    </div>
  );
}


