import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, Star, Calendar, Clock, Film, Users, Languages, Award, 
  Clapperboard, DollarSign, Bookmark, BookmarkCheck 
} from 'lucide-react';

// A small helper component for displaying detail items
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="w-4 h-4 mt-1 mr-3 text-[rgb(var(--text-muted))]" />
    <div>
      <p className="text-sm font-semibold text-[rgb(var(--text-muted))]">{label}</p>
      <p className="text-[rgb(var(--text-primary))]">{value || 'N/A'}</p>
    </div>
  </div>
);

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Check if movie is bookmarked
  const checkBookmarkStatus = async () => {
    if (!isAuthenticated || !id) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookmarks/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsBookmarked(data.isBookmarked);
        }
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${apiKey}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        
        const data = await response.json();
        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError(data.Error || "Movie not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    checkBookmarkStatus();
  }, [id, isAuthenticated]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark movies');
      return;
    }

    if (!movie) return;

    setBookmarkLoading(true);
    const token = localStorage.getItem('token');

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsBookmarked(false);
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to remove bookmark');
        }
      } else {
        // Add bookmark
        const response = await fetch('http://localhost:5000/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            movieId: id,
            title: movie.Title,
            poster: movie.Poster !== "N/A" ? movie.Poster : '',
            year: movie.Year,
            imdbRating: movie.imdbRating,
            genre: movie.Genre
          })
        });

        if (response.ok) {
          setIsBookmarked(true);
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to add bookmark');
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('An error occurred while updating bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[rgb(var(--bg-primary))]">
        <div className="loader"></div>
        <p className="mt-4 text-lg text-[rgb(var(--text-secondary))]">Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[rgb(var(--bg-primary))] p-4 text-center">
        <div className="max-w-md p-8 bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold font-[var(--font-display)] text-[rgb(var(--text-primary))]">Oops!</h2>
          <p className="mt-2 text-base text-[rgb(var(--text-secondary))]">{error}</p>
          <Link 
            to="/" 
            className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium 
                       bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))]
                       text-white rounded-lg transition-all duration-200 
                       transform hover:scale-105 active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] font-sans pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center mb-8 text-sm font-medium text-[rgb(var(--text-secondary))] 
                     hover:text-[rgb(var(--text-primary))] group transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Poster */}
          <div className="lg:col-span-1">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/500x750?text=No+Image"}
              alt={`Poster for ${movie.Title}`}
              className="w-full h-auto object-cover rounded-xl shadow-2xl 
                         border-4 border-solid border-[rgb(var(--border))]"
            />
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between">
              <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)] text-[rgb(var(--text-primary))] flex-1">
                {movie.Title}
              </h1>
              
              {/* Bookmark Button */}
              {isAuthenticated && (
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  className={`ml-4 p-3 rounded-xl border-2 transition-all duration-200 
                             transform hover:scale-105 active:scale-95 disabled:opacity-50 
                             disabled:cursor-not-allowed ${
                    isBookmarked 
                      ? 'bg-[rgb(var(--accent))] border-[rgb(var(--accent))] text-white' 
                      : 'bg-transparent border-[rgb(var(--border))] text-[rgb(var(--text-primary))] hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--accent))]'
                  }`}
                  title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  {bookmarkLoading ? (
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isBookmarked ? (
                    <BookmarkCheck className="w-6 h-6" />
                  ) : (
                    <Bookmark className="w-6 h-6" />
                  )}
                </button>
              )}
            </div>
            
            {/* Meta Info Tags */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-[rgb(var(--text-secondary))]">
              <span className="flex items-center"><Star className="w-4 h-4 mr-1.5 text-yellow-400" /> <strong>{movie.imdbRating}</strong>/10</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {movie.Runtime}</span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {movie.Year}</span>
              <span className="inline-block px-2 py-0.5 bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] rounded-md">{movie.Rated}</span>
            </div>
            
            <p className="mt-6 text-base leading-relaxed text-[rgb(var(--text-secondary))]">
              {movie.Plot}
            </p>

            {/* Details Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <DetailItem icon={Film} label="Genre" value={movie.Genre} />
              <DetailItem icon={Clapperboard} label="Director" value={movie.Director} />
              <DetailItem icon={Users} label="Actors" value={movie.Actors} />
              <DetailItem icon={Languages} label="Languages" value={movie.Language} />
              <DetailItem icon={Award} label="Awards" value={movie.Awards} />
              <DetailItem icon={DollarSign} label="Box Office" value={movie.BoxOffice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;