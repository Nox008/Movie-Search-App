import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import Profile from "./components/Profile";

const App = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;