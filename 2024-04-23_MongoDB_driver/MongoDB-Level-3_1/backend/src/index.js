import express from "express";
import morgan from "morgan";
import cors from "cors";
import { MovieDAO } from "./db-access/moviesDAO.js";
import { FavoritesDAO } from "./db-access/favoritesDAO.js";
import { ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(morgan("dev")); // middleware (logging ware)
app.use(express.json()); // body parser

app.get("/", (req, res) => res.json({ hello: "world" })); // zum testen obs funktioniert

// ! Endpunkte für alle Movies (nicht die Favorites)
// *alle Movies, die in der Datenbank sind finden und ausgeben bzw. zurückgeben lassen
app.get("/api/v1/movies", (req, res) => {
  //   Funktionsaufruf
  MovieDAO.findAll()
    .then((movies) => res.json(movies))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err, message: "could not find all movies" });
    });
});

// * sich einen bestimmten Movie anhand von ID ausgeben lassen
app.get("/api/v1/movies/:movieId", (req, res) => {
  // Variable für Id
  const movieId = req.params.movieId;

  // Hier wird die Id als Parameter an die Find One Funktion weitergegeben
  MovieDAO.findById(movieId)
    .then((movie) => res.json(movie))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err, message: "Could not find movie" + movieId });
    });
});

// * einen neuen Movie hinzufügen
app.post("/api/v1/movies", (req, res) => {
  const newMovie = req.body; //alles (kompletter body) was der User zum Beispiel in ein Formular eingibt (bzw. alles was ich zum testen in thunder client eingebe)

  //   Funktionsaufruf
  MovieDAO.insertOne(newMovie)
    .then((addedMovie) => res.json(addedMovie || {})) //wenn post nicht möglich war, dann leeres Objekt ausgeben und unten dann error ausgeben
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err, message: "Could not add new movie" });
    });
});

// * einen bestehenden Movie bearbeiten
app.patch("/api/v1/movies/:movieId", (req, res) => {
  // Variable für Id
  const movieId = req.params.movieId;
  // Variable für zu ändernden Infos aus dem request body
  const updateInfo = req.body;

  //   Funktionsaufruf
  MovieDAO.updateOne(movieId, updateInfo)
    .then((updatedMovie) => res.json(updatedMovie || {}))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err, message: "Could not update movie" });
    });
});

// * einen Movie löschen
app.delete("/api/v1/movies/:movieId", (req, res) => {
  // Variable für Id
  const movieId = req.params.movieId;

  // Funktionsaufruf
  MovieDAO.deleteOne(movieId)
    .then((deletedRecipe) => res.json(deletedRecipe || {}))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err, message: "Could not delete movie" });
    });
});

// ! Endpunkte für alle Movies (nicht die Favorites)
// * alle favorite Movies ausgeben lassen
app.get("/api/v1/favorites", (req, res) => {
  FavoritesDAO.showAllFavorites()
    .then((favoriteMovies) => res.json(favoriteMovies))
    .catch((err) => {
      console.log(err);
      res.status(200).json({ err, message: "Could not find favorite movies" });
    });
});

// * einen favorite Movie hinzufügen
app.post("/api/v1/movies/:movieId/favorites", (req, res) => {
  // Variable für Id
  const movieId = req.params.movieId;

  // hier wird die movieId in newDocumentInfo im richtigen Format gespeichert
  const newDocumentInfo = { movieId: ObjectId.createFromHexString(movieId) };

  // jetzt wird die Funktion addtoFavorites aufgerufen und die newDocumentInfo (also movieId) weitergegeben, so dass die movieId und die neu generierte Id im Dokument in der collection favorites gespeichert werden können
  FavoritesDAO.addToFavorites(newDocumentInfo)
    .then((addedFavorite) => res.json(addedFavorite || {}))
    .catch((err) =>
      res.status(500).json({ err, message: "Could not add movie to favorites" })
    );
});

// * einen favorite Movie löschen
app.delete("/api/v1/favorites/:favoritesId", (req, res) => {
  FavoritesDAO.deleteOne(req.params.favoritesId)
    .then((deletedFavorite) => res.json(deletedFavorite || {}))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err, message: "Could not delete favorite movie" });
    });
});

// - Server
const PORT = 3003;
app.listen(PORT, () => console.log("Server listenting at port", PORT));
