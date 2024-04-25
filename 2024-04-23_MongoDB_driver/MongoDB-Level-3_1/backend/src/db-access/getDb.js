import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL; // conenction url from mongodb atlas (MONGO_URL= bei mongoDB auf connect dann auf driver und dann die url dort kopieren (eigenes Passwort dort noch einfügen))

const client = new MongoClient(url);

export function getDb() {
  return client.connect().then((connectedClient) => {
    //Client bitte connecte dich mit der Datenbank, dann geben wir unserer Db einen Namen (rezepteDb) mit, dann wählen wir die Datenbank aus, greifen auf sie zu mit .db und geben Namen mit
    const dbName = "video";
    const db = connectedClient.db(dbName);
    return db;
  });
}
