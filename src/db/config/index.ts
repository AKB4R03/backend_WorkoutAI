import { MongoClient } from "mongodb";

const connectionDb = process.env.MONGODB_URI;
if (!connectionDb) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined");
}

let client: MongoClient;
// console.log('haloooo');

export const getMongoClientInstance = async () => {
  if (!client) {
    client = await MongoClient.connect(connectionDb);
    await client.connect();
  }

  return client;
};
