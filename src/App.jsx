import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";

const App = () => {
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
                  <Search />
                </div>
              </div>
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