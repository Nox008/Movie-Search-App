# Movie Search App

A modern, responsive movie search application built with React.js that allows users to search for movies and view detailed information using the OMDB API.

## Features

- 🔍 **Real-time Movie Search** - Search for movies by title with instant results
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎬 **Detailed Movie Information** - View movie posters, ratings, plot summaries, cast, and more
- ⚡ **Fast Performance** - Built with React.js for smooth user experience
- 🎨 **Modern UI** - Clean and intuitive interface styled with Tailwind CSS

## Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **API**: OMDB API (Open Movie Database)
- **Build Tool**: Vite

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn package manager
- OMDB API key (free registration required)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nox008/Movie-Search-App.git
   cd Movie-Search-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your OMDB API key:
   ```env
   VITE_OMDB_API_KEY=your_api_key_here
   ```
   
   To get your free API key:
   - Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
   - Register for a free account
   - Copy your API key to the `.env` file

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

   The app will open in your browser at `http://localhost:3000`

## Usage

1. Enter a movie title in the search bar
2. Browse through the search results
3. Click on any movie to view detailed information including:
   - Movie poster
   - Release year
   - Genre
   - Director and cast
   - Plot summary
   - IMDb rating
   - Runtime

## Project Structure

```
movie-search-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── MovieDetails.js
│   │   ├── Search.jsx
│   │   └── Hero.jsx
│   │   └── Navbar.jsx        
│   ├── App.jsx
│   ├── index.css
│   └── Main.jss
├── .env
├── package.json
└── README.md
```

## API Integration

This app uses the OMDB API to fetch movie data. The API provides:

- Movie search by title
- Detailed movie information
- Movie posters and ratings
- Cast and crew information

**API Endpoints Used:**
- Search: `http://www.omdbapi.com/?s={movie_title}&apikey={api_key}`
- Details: `http://www.omdbapi.com/?i={imdb_id}&apikey={api_key}`

## Build for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This will create a `build` folder with optimized files ready for deployment.

## Deployment

The app can be deployed to various platforms:

### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel
1. Connect your GitHub repository to Vercel
2. Set the environment variable `VITE_OMDB_API_KEY`
3. Deploy automatically with each push

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "gh-pages -d build"`
3. Run: `npm run deploy`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for providing movie data
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React.js](https://reactjs.org/) for the frontend framework

## Contact

Nox008 - https://nox-portfolio.vercel.app

Project Link: [https://github.com/Nox008/Movie-Search-App](https://github.com/Nox008/Movie-Search-App)

---

⭐ If you found this project helpful, please give it a star!