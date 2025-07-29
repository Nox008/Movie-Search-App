import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bookmark, Star, Calendar, Trash2, Search, Heart, 
  ArrowLeft, Clock, Film 
} from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title, rating
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to view your bookmarks');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBookmarks(data.bookmarks);
        } else {
          setError(data.message || 'Failed to fetch bookmarks');
        }
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('authToken'); // Remove invalid token
      } else {
        setError('Failed to fetch bookmarks');
      }
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
      setError('An error occurred while fetching bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (movieId, title) => {
    if (!confirm(`Remove "${title}" from bookmarks?`)) return;

    setDeleteLoading(movieId);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to manage bookmarks');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/bookmarks/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setBookmarks(prev => prev.filter(bookmark => bookmark.movieId !== movieId));
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove bookmark');
      }
    } catch (error) {
      console.error('Remove bookmark error:', error);
      alert('An error occurred while removing bookmark');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter and sort bookmarks
  const filteredAndSortedBookmarks = bookmarks
    .filter(bookmark => 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
        case 'newest':
        default:
          return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-primary))] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="loader"></div>
            <p className="mt-4 text-lg text-[rgb(var(--text-secondary))]">Loading your bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-primary))] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="max-w-md p-8 bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] rounded-lg shadow-lg text-center">
              <Heart className="w-16 h-16 mx-auto text-[rgb(var(--text-muted))] mb-4" />
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] font-sans pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center mb-6 text-sm font-medium text-[rgb(var(--text-secondary))] 
                       hover:text-[rgb(var(--text-primary))] group transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Search
          </Link>

          <div className="flex items-center mb-6">
            <Bookmark className="w-8 h-8 mr-3 text-[rgb(var(--accent))]" />
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)] text-[rgb(var(--text-primary))]">
              My Bookmarks
            </h1>
          </div>

          <p className="text-lg text-[rgb(var(--text-secondary))] mb-8">
            {bookmarks.length} movie{bookmarks.length !== 1 ? 's' : ''} saved
          </p>

          {/* Search and Sort Controls */}
          {bookmarks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-muted))]" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] 
                           rounded-lg text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-muted))]
                           focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent
                           transition-all duration-200"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] 
                         rounded-lg text-[rgb(var(--text-primary))] focus:outline-none 
                         focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent
                         transition-all duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="rating">Rating (High-Low)</option>
              </select>
            </div>
          )}
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bookmark className="w-24 h-24 text-[rgb(var(--text-muted))] mb-6" />
            <h2 className="text-2xl font-bold font-[var(--font-display)] text-[rgb(var(--text-primary))] mb-2">
              No bookmarks yet
            </h2>
            <p className="text-base text-[rgb(var(--text-secondary))] mb-8 text-center max-w-md">
              Start exploring movies and bookmark your favorites to see them here!
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 text-base font-medium 
                         bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))]
                         text-white rounded-lg transition-all duration-200 
                         transform hover:scale-105 active:scale-95"
            >
              <Search className="w-5 h-5 mr-2" />
              Discover Movies
            </Link>
          </div>
        ) : filteredAndSortedBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="w-24 h-24 text-[rgb(var(--text-muted))] mb-6" />
            <h2 className="text-2xl font-bold font-[var(--font-display)] text-[rgb(var(--text-primary))] mb-2">
              No results found
            </h2>
            <p className="text-base text-[rgb(var(--text-secondary))] text-center">
              Try adjusting your search term
            </p>
          </div>
        ) : (
          /* Bookmarks Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedBookmarks.map((bookmark) => (
              <div 
                key={bookmark.movieId}
                className="group bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] 
                           rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                           transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={bookmark.poster || "https://via.placeholder.com/400x600?text=No+Image"}
                    alt={`Poster for ${bookmark.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 
                               group-hover:scale-105"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <Link
                        to={`/movie/${bookmark.movieId}`}
                        className="px-4 py-2 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))]
                                   text-white rounded-lg text-sm font-medium transition-all duration-200
                                   transform hover:scale-105 active:scale-95"
                      >
                        View Details
                      </Link>
                      
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.movieId, bookmark.title)}
                        disabled={deleteLoading === bookmark.movieId}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                                   text-sm font-medium transition-all duration-200 transform 
                                   hover:scale-105 active:scale-95 disabled:opacity-50 
                                   disabled:cursor-not-allowed flex items-center"
                      >
                        {deleteLoading === bookmark.movieId ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold font-[var(--font-display)] text-[rgb(var(--text-primary))] 
                                 mb-2 line-clamp-2 group-hover:text-[rgb(var(--accent))] 
                                 transition-colors duration-200">
                    {bookmark.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-[rgb(var(--text-secondary))] mb-3">
                    {bookmark.year && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {bookmark.year}
                      </span>
                    )}
                    {bookmark.imdbRating && bookmark.imdbRating !== 'N/A' && (
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {bookmark.imdbRating}
                      </span>
                    )}
                  </div>

                  {bookmark.genre && bookmark.genre !== 'N/A' && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {bookmark.genre.split(', ').slice(0, 2).map((genre, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border))] 
                                     rounded-md text-xs text-[rgb(var(--text-secondary))]"
                        >
                          {genre}
                        </span>
                      ))}
                      {bookmark.genre.split(', ').length > 2 && (
                        <span className="px-2 py-1 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border))] 
                                         rounded-md text-xs text-[rgb(var(--text-secondary))]">
                          +{bookmark.genre.split(', ').length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[rgb(var(--text-muted))]">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                    </span>
                    <Bookmark className="w-4 h-4 text-[rgb(var(--accent))]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;