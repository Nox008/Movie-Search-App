import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import Profile from "./components/Profile";
import Bookmarks from "./components/Bookmarks";

const App = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/bookmarks" element={<Bookmarks/>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;