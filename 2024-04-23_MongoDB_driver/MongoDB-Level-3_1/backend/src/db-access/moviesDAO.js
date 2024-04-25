import { ObjectId } from "mongodb";
import { getDb } from "./getDb.js";

// * Funktion um alle Movies zu finden
function findAll() {
  // wir greifen auf unsere Datenbank zu mit db., navigieren dann in unsere Collection, suchen alle und lassen sie uns in einem Array ausgeben
  return getDb().then((db) => db.collection("movieDetails").find().toArray()); //movieDetails heißt meine Collection, video heißt meine Datenbank
}

// * Funktion um einen bestimmten Movie zu finden
function findById(id) {
  const idAsObjectId = ObjectId.createFromHexString(id); //normale ID wird umgewandelt (war ursprünglich String) in die Form, in der die ObjectID geschrieben wird (zum Vergleichen im gleichen Format später)
  return getDb().then(
    (db) => db.collection("movieDetails").findOne({ _id: idAsObjectId }) // find one anhand von ungewandelter ID
  );
}

// * Funktion um einen neuen Movie hinzuzufügen
function insertOne(documentInfo) {
  return (
    getDb()
      .then((db) => db.collection("movieDetails").insertOne(documentInfo)) // { acknowledged: true, insertedId: ObjectId("...") }
      // mit insertOne bekommen wir Werte (wie z.B. insertedId) zurück und mit denen arbeiten wir dann im Folgenden weiter
      .then(
        (result) =>
          result.acknowledged
            ? { ...documentInfo, _id: result.insertedId }
            : null // kopie vom dokument mit _id (===> gleicher wert wie in der datenbank)
      )
  );
}

// * Funktion um einen Film zu bearbeiten
function updateOne(id, updateInfo) {
  const idAsObjectId = ObjectId.createFromHexString(id);
  return getDb()
    .then((db) =>
      db
        .collection("movieDetails")
        .updateOne({ _id: idAsObjectId }, { $set: updateInfo })
    ) // erster Wert: Welche Datei soll geupdated werden?; zweiter Wert: Was soll verändert/hinzugefügt... werden
    .then((result) => {
      if (result.acknowledged && result.modifiedCount === 1)
        //acknowledged soll true sein und es soll modified (geupdated) sein (1)
        return findById(id);
      // so kann man sich dokument nach dem update ausgeben lassen
      else return null;
    });
}

// * Funktion um einen Film zu löschen
function deleteOne(id) {
  const idAsObjectId = ObjectId.createFromHexString(id);
  return getDb().then((db) =>
    db.collection("movieDetails").findOneAndDelete({ _id: idAsObjectId })
  );
}

// * Exportieren aller Funktionen in einem Objekt, so dass man in der index.js über dot notation auf die Funktionen zugreifen kann
export const MovieDAO = {
  findAll,
  findById,
  insertOne,
  updateOne,
  deleteOne,
};
