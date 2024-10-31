import { Db, ObjectId } from "mongodb";
import { getMongoClientInstance } from "../config";
import { hash } from "../utils/bcrypt";

type UserInfoModel = {
  username: string;
  email: string;
  password: string;
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
  const modifUser: UserInfoModel = {
    ...user,
    password: hash(user.password),
  };

  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(modifUser);

  return result;
};

export const getUserByEmail = async (email: string) => {
  const db = await getDb();
  const user = await db.collection(COLLECTION_NAME).findOne({ email: email });

  return user;
};

export const getUserWeightById = async (userId: string) => {
  const db = await getDb();
  const user = await db
    .collection(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(userId) });

  // Memeriksa apakah user ditemukan
  if (user) {
    return user.weight; // Mengembalikan nilai weight dalam bentuk number
  } else {
    return null; // Mengembalikan null jika user tidak ditemukan
  }
};
