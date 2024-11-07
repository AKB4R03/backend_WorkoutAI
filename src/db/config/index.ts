import { MongoClient } from "mongodb";

// console.log(process.env.MONGODB_CONNECTION_STRING);

const connectionDb =
  process.env.MONGODB_CONNECTION_STRING ||
  "mongodb+srv://masakbar2905:mei555@cluster0.ratubnl.mongodb.net/?retryWrites=true&w=majority";
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
