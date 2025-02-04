import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [noMoviesFound, setNoMoviesFound] = useState(false);

  const handleSearch = async (query) => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    const response = await fetch(
      `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
    );
    const data = await response.json();
    if (data.Search) {
      setMovies(data.Search);
      setNoMoviesFound(false); // Reset no movies found state
    } else {
      setMovies([]); // Clear movies
      setNoMoviesFound(true); // Set no movies found state
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="hero bg-blue-500 py-16 flex-grow">
                <div className="container mx-auto text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">Search Movies</h2>
                  <Search onSearch={handleSearch} />
                </div>
              </div>
              {noMoviesFound ? (
                <p className="text-center text-red-500 text-xl my-8">
                  No movies found. Please try another search.
                </p>
              ) : (
                <MovieList movies={movies} />
              )}
            </>
          }
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;