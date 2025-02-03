import React from 'react'

const Navbar = () => {
    return (
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Search Movies</h1>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-200">Login</a>
            <a href="#" className="hover:text-gray-200">Signup</a>
            <a href="#" className="hover:text-gray-200">Bookmarks</a>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;