import { useState, useEffect } from "react";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
          setSuggestions(data.Search.slice(0, 8)); // Show only the first 5 suggestions
        } else {
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions if the query is too short
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex justify-center my-4">
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

      {/* Suggestions Slider */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-blue-300 shadow-lg rounded-lg mt-2 z-10">
          <div className="flex overflow-x-auto p-4 space-x-4">
            {suggestions.map((movie) => (
              <div
                key={movie.imdbID}
                className="flex-shrink-0 w-40 cursor-pointer"
                onClick={() => {
                  setQuery(movie.Title); // Fill the search box with the selected movie title
                  setSuggestions([]); // Clear suggestions
                  onSearch(movie.Title); // Trigger search
                }}
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