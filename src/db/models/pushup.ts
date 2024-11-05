import { Db, ObjectId } from "mongodb";
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

  // Mendapatkan bulan saat ini (0-11, jadi tambahkan 1 untuk mendapatkan 1-12)
  const month = new Date().getMonth() + 1;

  const data = {
    woName: key, // Mengatur woName sesuai dengan nilai dari kunci pertama
    sumWo: value,
    totalCalories: totalCalories.toFixed(1), // Mengonversi totalCalories menjadi string dengan 1 desimal
    userId: new ObjectId(userId),
    month: month, // Menambahkan bulan ke data
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

  return result;
};

export const getTotalCaloriesByUser = async (userId: string) => {
  const db = await getDb();

  const result = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          userId: new ObjectId(userId), // Memfilter berdasarkan userId
        },
      },
      {
        $group: {
          _id: { month: "$month" }, // Mengelompokkan berdasarkan bulan
          totalCalories: { $sum: { $toDouble: "$totalCalories" } }, // Menjumlahkan total kalori
        },
      },
      {
        $project: {
          _id: 0, // Tidak menyertakan _id
          totalCalories: { $round: ["$totalCalories", 1] }, // Menghitung total kalori dengan 1 desimal
          month: "$_id.month", // Menyertakan bulan dalam hasil
        },
      },
    ])
    .toArray();

  // Mengembalikan hasil dalam format yang diinginkan
  return result.length > 0 ? result : [];
};
