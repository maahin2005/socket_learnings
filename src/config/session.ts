import session from "express-session";
import MongoStore from "connect-mongo";
import { envConfig } from "./env";

export const sessionConfig = session({
  secret: envConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: envConfig.sessionMaxAge,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  store: MongoStore.create({
    mongoUrl: envConfig.mongodbUri,
    touchAfter: 24 * 3600, // lazy session update
    collectionName: "sessions",
    ttl: envConfig.sessionMaxAge / 1000, // TTL in seconds
  }),
  name: "socket-chat-session",
});

console.log("✅ Session configuration initialized");
