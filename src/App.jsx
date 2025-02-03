import { useState } from "react";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";

const App = () => {
  const [movies, setMovies] = useState([]);

  const handleSearch = async (query) => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    const response = await fetch(
      `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
    );
    const data = await response.json();
    if (data.Search) {
      setMovies(data.Search);
    } else {
      setMovies([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="hero bg-blue-500 py-16 flex-grow">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Search Movies</h2>
          <Search onSearch={handleSearch} />
        </div>
      </div>
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
};

export default App;