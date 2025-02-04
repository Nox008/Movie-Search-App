import { Link } from "react-router-dom";

const MovieList = ({ movies }) => {
  if (movies.length === 0) {
    return null; // Return nothing if no movies are passed
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {movies.map((movie) => (
        <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID}>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}
              alt={movie.Title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{movie.Title}</h3>
              <p className="text-gray-600">{movie.Year}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MovieList;