import { ObjectId } from "mongodb";
import { getDb } from "./getDb.js";

// * Funktion, um alle favorite Movies anzuzeigen
function showAllFavorites() {
  return getDb()
    .then((db) => db.collection("favorites").find().toArray()) // so bekomm ich Objekte in einem Array raus, also so beispielsweise: [{_id: favoritesId, movieId: movieId] -> (Id, die beim Createn von einem Dokument immer automatisch erstellt wird und die movieID von MovieDAO)
    .then((foundFavorites) =>
      foundFavorites.map((singleFavorite) => singleFavorite.movieId)
    ) // ich mappe durch das Array von oben und greife dann mit dot notation auf die movieIds zu, so dass ich sie alle gesammelt habe.
    .then((movieIds) => Promise.all([getDb(), movieIds])) // hier müssen die Funktion getDb() und die movieIds weitergegeben werden, damit wir mit beiden weiterarbeiten können, denn wir wollen mit der getDb() in der Collection movieDetails nach den gefundenen Filmen suchen
    .then(
      ([db, movieIds]) =>
        db
          .collection("movieDetails") //ich navigier in die movieDetails collection
          .find({ _id: { $in: movieIds } }) //und suche hier nach den gefundenen ids (movieIds) in der movieDetails collection
          .toArray() // und lasse mir die gefundenen Ergebnisse als Array ausgeben
    );
}

// * Funktion, um einen Film zu Favorites hinzuzufügen
// wir werden in der index.js die id des movies aus req auslesen
// diese dann als Inhalt im newDocumentInfo speichern
// so hat ein document in der favorites collection dann zwei Inhalte: Die automatisch generierte Id und die movieId
function addToFavorites(newDocumentInfo) {
  return getDb()
    .then((db) => db.collection("favorites").insertOne(newDocumentInfo))
    .then((result) =>
      result.acknowledged
        ? { _id: result.insertedId, ...newDocumentInfo }
        : null
    );
}

// * Funktion, um einen bestimmten favorisierten Movie zu löschen
function deleteFromFavorites() {
  const idAsObjectId = ObjectId.createFromHexString(id);

  return getDb().then((db) =>
    db.collection("favorites").findOneAndDelete({ _id: idAsObjectId })
  );
}

// * Exportieren aller Funktionen in einem Objekt, so dass man in der index.js über dot notation auf die Funktionen zugreifen kann
export const FavoritesDAO = {
  showAllFavorites,
  addToFavorites,
  deleteFromFavorites,
};
