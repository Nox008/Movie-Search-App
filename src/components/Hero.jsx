import Search from "./Search";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[rgb(var(--bg-primary))]">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--bg-primary))] via-[rgb(var(--bg-secondary))] to-[rgb(var(--bg-primary))]" />
      
      {/* Floating Orbs for Visual Interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[rgb(var(--accent))] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-[rgb(var(--accent-hover))] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[rgb(var(--accent))] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Hero Title */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[rgb(var(--text-primary))] 
                         font-[var(--font-display)] leading-tight tracking-tight">
            <span className="inline-block transform transition-transform duration-500 hover:scale-105">
              Discover
            </span>{" "}
            <span className="inline-block bg-gradient-to-r from-[rgb(var(--accent))] to-[rgb(var(--accent-hover))] 
                           bg-clip-text text-transparent transform transition-transform duration-500 hover:scale-105"
                  style={{ animationDelay: '0.2s' }}>
              Movies
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-[rgb(var(--text-secondary))] 
                       font-[var(--font-sans)] max-w-2xl mx-auto leading-relaxed">
            Search through millions of movies and discover your next favorite film
          </p>
        </div>

        {/* Search Component */}
        <div className="w-full max-w-3xl mx-auto">
          <Search />
        </div>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-4">
          {['Instant Search', 'HD Posters', 'Detailed Info', 'Ratings & Reviews'].map((feature, index) => (
            <div
              key={feature}
              className="px-4 py-2 bg-[rgb(var(--bg-glass))] backdrop-blur-sm 
                         border border-[rgb(var(--border))] rounded-full
                         text-sm font-medium text-[rgb(var(--text-secondary))]
                         hover:text-[rgb(var(--text-primary))] hover:border-[rgb(var(--accent))]
                         transition-all duration-300 transform hover:scale-105
                         font-[var(--font-sans)]"
              style={{ 
                animation: `fadeInUp 0.6s ease-out forwards`,
                animationDelay: `${0.8 + index * 0.1}s`,
                opacity: 0
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
 {/*      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[rgb(var(--text-muted))] rounded-full p-1">
          <div className="w-1 h-3 bg-[rgb(var(--text-muted))] rounded-full mx-auto animate-pulse" />
        </div>
      </div> */}
    </div>
  );
};

export default Hero;