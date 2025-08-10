import session from "express-session";
import MongoStore from "connect-mongo";
import { envConfig } from "./env";

export const sessionConfig = session({
  secret: envConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: envConfig.sessionMaxAge,
    httpOnly: true,
    sameSite: "none", // Use 'lax' or 'strict' if you don't need cross-site cookies
  },
  store: MongoStore.create({
    mongoUrl: envConfig.mongodbUri,
    touchAfter: 24 * 3600, // lazy session update
    collectionName: "sessions",
    ttl: envConfig.sessionMaxAge / 1000, // TTL in seconds
  }),
  name: "hydro-vatika-session",
});

console.log("✅ Session configuration initialized");
