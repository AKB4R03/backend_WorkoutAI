import jwt from "jsonwebtoken";

import * as jose from "jose";

const SECRET_KEY = "RAHASIA NGABBB";

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY);
};

export const readPayload = async <T>(token: string) => {
  const secretKey = new TextEncoder().encode(SECRET_KEY);
  const payloadJose = await jose.jwtVerify<T>(token, secretKey);

  return payloadJose.payload;
};
