import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Packages from "@/components/Packages";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="animate-fadeIn">
        <Hero />
      </div>
      <div className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
        <Features />
      </div>
      <div className="animate-slideUp" style={{ animationDelay: "0.4s" }}>
        <Packages />
      </div>
      <div className="animate-fadeIn" style={{ animationDelay: "0.6s" }}>
        <Footer />
      </div>
    </main>
  );
}
