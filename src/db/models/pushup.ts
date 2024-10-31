import { Db, MongoClient, ObjectId } from "mongodb";
import { getMongoClientInstance } from "../config";

type PushUpInfoModel = {
  weight: number;
  [pushUps: string]: number;
};

const DATABASE_NAME = "Workout_AI";
const COLLECTION_NAME = "workOutInfo";

export const getDb = async () => {
  const client = await getMongoClientInstance();
  const db: Db = client.db(DATABASE_NAME);

  return db;
};

export const insertPushUpInfo = async (
  woData: PushUpInfoModel,
  totalCalories: number,
  userId: string
) => {
  const db = await getDb();

  // Ambil kunci pertama dari woData
  const key = Object.keys(woData)[0]; // Mendapatkan kunci pertama
  const value = woData[key]; // Mengambil nilai dari kunci pertama

  const data = {
    woName: key, // Mengatur woName sesuai dengan nilai dari kunci pertama
    sumWo: value,
    totalCalories: totalCalories.toFixed(1),
    userId: new ObjectId(userId),
  };

  const result = await db.collection(COLLECTION_NAME).insertOne(data);

  return result;
};

export const getWoInfo = async (userId: string) => {
  const db = await getDb();

  const result = await db
    .collection(COLLECTION_NAME)
    .aggregate([{ $match: { userId: new ObjectId(userId) } }])
    .toArray();

  // console.log(result, "++ cart ++");

  return result;
};

export async function deleteAllDocuments() {
  const uri =
    "mongodb+srv://masakbar2905:mei555@cluster0.ratubnl.mongodb.net/?retryWrites=true&w=majority"; // Ganti dengan URI Anda
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Workout_AI"); // Ganti dengan nama database Anda
    const collection = database.collection("workOutInfo"); // Ganti dengan nama collection Anda

    const result = await collection.deleteMany({});
    console.log(`${result.deletedCount} documents were deleted.`);
  } finally {
    await client.close();
  }
}

deleteAllDocuments().catch(console.error);
