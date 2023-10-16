import { useEffect, useRef, useState } from "react";

const average = (arr) =>{
  console.log(arr)
  return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
}

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const inputEl = useRef(null)
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgRuntime = average(watched.map((movie) =>(movie.Runtime)?.split(' ')[0]));

  // const controller = new AbortController() 
  function handleOnselect(id) {
    setIsOpen3(true);
    setSelectedId(id);
  }
  function handleFavorite(data){
    setIsOpen3(false)
    setWatched([...watched,data])
  }

  useEffect(function(){
    document.addEventListener('keydown',(e)=>callback(e))
    function callback(e){
      if (e.key === 'Enter') inputEl.current.focus()
    }
    inputEl.current.focus()
  },[])

  useEffect(
    function () {
      async function fechingMovies() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=1696f67e&s=${query}`
        );
        const data = await res.json();
        console.log(data);
        setMovies(data.Search);
        setIsLoading(false);
      }
      fechingMovies();
    },
    [query]
  );

  return (
    <>
      <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputEl}
        />
        <p className="num-results">
          {/* Found <strong>{movies.length}</strong> results */}
        </p>
      </nav>

      <main className="main">
      {console.log(movies)}

        <div className="box" style={{overflowY:`${movies?.length>6? 'scroll':'hidden'}`}}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <button
                className="btn-toggle"
                onClick={() => setIsOpen1((open) => !open)}
              >
                {isOpen1 ? "–" : "+"}
              </button>
              {isOpen1 && (
                <ul className="list">
                  {movies?.map((movie) => (
                    <li
                      key={movie.imdbID}
                      onClick={() => handleOnselect(movie.imdbID)}
                    >
                      <img src={movie.Poster} alt={`${movie.Title} poster`} />
                      <h3>{movie.Title}</h3>
                      <div>
                        <p>
                          <span>🗓</span>
                          <span>{movie.Year}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="box" style={{overflowY:`${watched?.length>5? 'scroll':'hidden'}`}} >
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 &&
            (isOpen3 ? (
              <MovieDetails handleFavorite={handleFavorite} setIsOpen3={setIsOpen3} selectedId={selectedId} />
            ) : (
              <Box watched={watched} avgImdbRating={avgImdbRating} avgRuntime={avgRuntime} setWatched={setWatched} />
            ))}
        </div>
      </main>
    </>
  );
}
function Box({ watched,avgImdbRating,avgRuntime,setWatched }) {
  function handleDelete (id){
    setWatched(watched.filter((item)=>item.imdbID!==id))
  }
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating.toFixed(2)}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime.toFixed(1)} min</span>
          </p>
        </div>
      </div>

      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.Runtime}</span>
              </p>
              <button className="delete" onClick={()=>handleDelete(movie.imdbID)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}

function MovieDetails({ selectedId, setIsOpen3,handleFavorite }) {
  const [movieData, setMovieData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(
    function () {
      async function fechingMoviesData() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=1696f67e&i=${selectedId}`
        );
        const data = await res.json();
        console.log(data);
        setMovieData(data);
        setIsLoading(false);
      }
      fechingMoviesData();
    },
    [selectedId]
  );
  useEffect(function(){
    document.title = `Movie : ${movieData.Title}`
    console.log(movieData)
    return function(){
      document.title = `Movies Rate`
    }
  },[movieData])

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button className="btn-back" onClick={() => setIsOpen3(false)}>
            &larr;
          </button>
          <header>
            <img src={`${movieData.Poster}`} alt={movieData.Title} />
            <div className="details-overview">
              <h2>{movieData.Title}</h2>
              <p>{`${movieData.Released} . ${movieData.Runtime}`}</p>
              <p>{movieData.Genre}</p>
              <p>⭐ {`${movieData.imdbRating} Imdb Rating`}</p>
            </div>
          </header>
          <section>
            <p>{movieData.Plot}</p>
            <p>starring {movieData.Actors}</p>
            <p>Directed by {movieData.Director}</p>
            <button className="btn-add" onClick={()=>handleFavorite(movieData)}>Add to favorite</button>
          </section>
        </>
      )}
    </div>
  );
}
