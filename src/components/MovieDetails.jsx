import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      const response = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`
      );
      const data = await response.json();
      setMovie(data);
      setLoading(false);
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center text-xl my-8">Loading...</p>;
  }

  if (!movie) {
    return <p className="text-center text-red-500 text-xl my-8">Movie not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline">
        &larr; Back to Home
      </Link>
      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}
          alt={movie.Title}
          className="w-full h-96 object-contain" // Fixed height and aspect ratio
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
          <p className="text-gray-600 mb-4">{movie.Year}</p>
          <p className="text-gray-700 mb-4">{movie.Plot}</p>
          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full">
              IMDB Rating: {movie.imdbRating}
            </span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full">
              Released: {movie.Released}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p><strong>Genre:</strong> {movie.Genre}</p>
              <p><strong>Director:</strong> {movie.Director}</p>
              <p><strong>Actors:</strong> {movie.Actors}</p>
              <p><strong>Runtime:</strong> {movie.Runtime}</p>
              <p><strong>Languages:</strong> {movie.Language}</p>
            </div>
            <div>
              {/* <h2 className="text-xl font-semibold mb-2">Additional Info</h2> */}
              <p><strong>Rated:</strong> {movie.Rated}</p>
              <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
              <p><strong>Country:</strong> {movie.Country}</p>
              <p><strong>Awards:</strong> {movie.Awards}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;