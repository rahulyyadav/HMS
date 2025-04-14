import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Healthcare background"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
          style={{ filter: "brightness(0.65)" }}
        />
      </div>

      <div className="absolute inset-0 z-0 opacity-80 bg-gradient-to-r from-primary-dark/90 to-primary/80">
        <div className="absolute inset-0 bg-[url(/grid-pattern.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <div className="flex-1 text-center lg:text-left pt-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Your Health Journey, <br />
              <span className="text-accent">Simplified</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              HMS helps you track, monitor, and improve your health with
              cutting-edge technology and personalized care plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/login"
                className="px-8 py-3 bg-accent text-white font-medium rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Login / Sign Up
              </Link>
              <Link
                href="/packages"
                className="px-8 py-3 bg-white text-primary font-medium rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                View Packages
              </Link>
              <Link
                href="/doctors"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors duration-300"
              >
                Find Doctors
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-secondary rounded-lg blur opacity-75"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-custom">
                <div className="relative w-full h-[250px]">
                  <Image
                    src="/hero-image.jpg"
                    alt="Health monitoring dashboard"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="rounded-md object-cover"
                    priority
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-light">
                      Real-time Monitoring
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Access your health metrics anytime, anywhere
                    </p>
                  </div>
                  <div className="bg-secondary/10 text-secondary font-medium text-sm px-3 py-1 rounded-full">
                    New Feature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L60 8C120 16 240 32 360 40C480 48 600 48 720 42.7C840 37.3 960 26.7 1080 26.7C1200 26.7 1320 37.3 1380 42.7L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
