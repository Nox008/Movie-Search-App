import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (query.length > 2) {
      // Fetch suggestions only if the query has more than 2 characters
      const fetchSuggestions = async () => {
        const apiKey = import.meta.env.VITE_OMDB_API_KEY;
        const response = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
        );
        const data = await response.json();
        if (data.Search) {
          setSuggestions(data.Search.slice(0, 20)); // Show up to 20 suggestions
        } else {
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions if the query is too short
    }
  }, [query]);

  const handleSuggestionClick = (imdbID) => {
    navigate(`/movie/${imdbID}`); // Navigate to the movie details page
    setQuery(""); // Clear the search query
    setSuggestions([]); // Clear suggestions
  };

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (suggestions.length > 0) {
            handleSuggestionClick(suggestions[0].imdbID); // Navigate to the first suggestion
          }
        }}
        className="flex justify-center my-4"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="p-3 w-96 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {suggestions.map((movie) => (
              <div
                key={movie.imdbID}
                className="cursor-pointer"
                onClick={() => handleSuggestionClick(movie.imdbID)} // Navigate to movie details
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x225"}
                  alt={movie.Title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm font-semibold mt-2">{movie.Title}</p>
                <p className="text-xs text-gray-600">{movie.Year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;