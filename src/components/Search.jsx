import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Film, Calendar, Star, Loader2 } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      const debounceTimer = setTimeout(async () => {
        try {
          const apiKey = import.meta.env.VITE_OMDB_API_KEY;
          const response = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
          );
          const data = await response.json();
          if (data.Search) {
            setSuggestions(data.Search.slice(0, 12));
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSuggestionClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
    setQuery("");
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].imdbID);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`
          relative flex items-center bg-[rgb(var(--bg-glass))] backdrop-blur-xl
          border border-[rgb(var(--border))] rounded-2xl
          transition-all duration-300 ease-out
          ${isFocused 
            ? 'border-[rgb(var(--accent))] shadow-2xl shadow-[rgb(var(--accent))]/20 scale-[1.02]' 
            : 'hover:border-[rgb(var(--accent))] hover:shadow-lg'
          }
        `}>
          {/* Search Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            <SearchIcon className={`
              w-5 h-5 transition-all duration-300
              ${isFocused 
                ? 'text-[rgb(var(--accent))] scale-110' 
                : 'text-[rgb(var(--text-muted))]'
              }
            `} />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for movies..."
            className="w-full pl-12 pr-20 py-4 bg-transparent text-[rgb(var(--text-primary))]
                     placeholder-[rgb(var(--text-muted))] font-[var(--font-sans)]
                     text-lg focus:outline-none transition-all duration-300"
          />

          {/* Loading Indicator or Search Button */}
          <div className="absolute right-2 flex items-center">
            {isLoading ? (
              <div className="p-3">
                <Loader2 className="w-5 h-5 text-[rgb(var(--accent))] animate-spin" />
              </div>
            ) : (
              <button
                type="submit"
                disabled={!query.trim()}
                className="flex items-center px-6 py-3 bg-[rgb(var(--accent))] 
                         hover:bg-[rgb(var(--accent-hover))] disabled:opacity-50
                         text-white rounded-xl font-medium font-[var(--font-sans)]
                         transition-all duration-200 transform hover:scale-105 
                         active:scale-95 disabled:hover:scale-100
                         shadow-lg hover:shadow-xl"
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                Search
              </button>
            )}
          </div>
        </div>

        {/* Search Suggestions */}
        {(suggestions.length > 0 || (query.length > 2 && !isLoading)) && (
          <div className="absolute top-full left-0 right-0 mt-4 
                         bg-[rgb(var(--bg-glass))] backdrop-blur-xl
                         border border-[rgb(var(--border))] rounded-2xl
                         shadow-2xl shadow-black/10 z-50 overflow-hidden
                         animate-in slide-in-from-top-2 duration-300">
            
            {suggestions.length > 0 ? (
              <>
                {/* Results Header */}
                <div className="px-6 py-4 border-b border-[rgb(var(--border))]">
                  <p className="text-sm font-medium text-[rgb(var(--text-muted))] font-[var(--font-sans)]">
                    {suggestions.length} results found
                  </p>
                </div>

                {/* Results Grid */}
                <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((movie, index) => (
                      <div
                        key={movie.imdbID}
                        className="group cursor-pointer p-3 rounded-xl
                                 hover:bg-[rgb(var(--bg-secondary))] transition-all duration-200
                                 transform hover:scale-[1.02] active:scale-95"
                        onClick={() => handleSuggestionClick(movie.imdbID)}
                        style={{
                          animation: `slideInUp 0.3s ease-out forwards`,
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <div className="flex space-x-3">
                          {/* Movie Poster */}
                          <div className="flex-shrink-0">
                            <div className="relative overflow-hidden rounded-lg w-16 h-24 bg-[rgb(var(--bg-secondary))]">
                              {movie.Poster !== "N/A" ? (
                                <img
                                  src={movie.Poster}
                                  alt={movie.Title}
                                  className="w-full h-full object-cover transition-transform duration-300
                                           group-hover:scale-110"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Film className="w-6 h-6 text-[rgb(var(--text-muted))]" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Movie Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[rgb(var(--text-primary))] 
                                         font-[var(--font-display)] text-sm leading-tight
                                         truncate group-hover:text-[rgb(var(--accent))]
                                         transition-colors duration-200">
                              {movie.Title}
                            </h3>
                            
                            <div className="flex items-center mt-1 space-x-2">
                              <div className="flex items-center text-xs text-[rgb(var(--text-muted))]">
                                <Calendar className="w-3 h-3 mr-1" />
                                {movie.Year}
                              </div>
                              
                              <div className="flex items-center text-xs text-[rgb(var(--text-muted))]">
                                <Film className="w-3 h-3 mr-1" />
                                {movie.Type?.charAt(0).toUpperCase() + movie.Type?.slice(1) || 'Movie'}
                              </div>
                            </div>

                            {movie.imdbRating && (
                              <div className="flex items-center mt-1">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                <span className="text-xs text-[rgb(var(--text-muted))]">
                                  {movie.imdbRating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="px-6 py-8 text-center">
                <Film className="w-12 h-12 text-[rgb(var(--text-muted))] mx-auto mb-4 opacity-50" />
                <p className="text-[rgb(var(--text-muted))] font-[var(--font-sans)]">
                  No movies found for "{query}"
                </p>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;