import { Db } from "mongodb";
import { getMongoClientInstance } from "../config";

type UserInfoModel = {
  username: string;
  email: string;
  height: number;
  weight: number;
};

const DATABASE_NAME = "Workout_AI";
const COLLECTION_NAME = "userInfo";

export const getDb = async () => {
  const client = await getMongoClientInstance();
  const db: Db = client.db(DATABASE_NAME);

  return db;
};

export const insertUserInfo = async (user: UserInfoModel) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(user);

  return result;
};
