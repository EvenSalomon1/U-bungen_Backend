import "./Home.css";
import { useState, useEffect } from "react";

const Home = () => {
  // * State, in dem alle Movies gespeichert werden
  const [movies, setMovies] = useState([]);

  // * fetch um alle Movies auszugeben und in setMovies zu speichern
  useEffect(() => {
    fetch("http://localhost:3003/api/v1/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.log(err));
  }, []);

  console.log(movies);
  return (
    <>
      <h1>Home</h1>
      <section className="movies">
        {movies?.map((film, index) => (
          <div key={index}>
            <p>{film.title}</p>
            <p>{film.director}</p>
          </div>
        ))}
      </section>
    </>
  );
};

export default Home;
