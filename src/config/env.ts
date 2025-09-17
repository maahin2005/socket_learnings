import dotenv from "dotenv";
import { ApiError } from "../utils/apiError";

interface ProcessEnv {
  [key: string]: string;
}

const myEnv: ProcessEnv = {};

dotenv.config({ processEnv: myEnv, debug: false });

interface EnvConfig {
  port: number;
  mongodbUri: string;
  sessionSecret: string;
  sessionMaxAge: number;
  clientOrigins: string[];
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = myEnv[key] || defaultValue;
  if (!value) {
    throw new ApiError(`Environment variable ${key} is not set`);
  }
  return value;
};

export const envConfig: EnvConfig = {
  port: parseInt(getEnvVar("PORT", "3000"), 10),
  mongodbUri: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/mydatabase"),
  sessionSecret: getEnvVar("SESSION_SECRET", "mysecretkey"),
  // Default to 14 days in milliseconds if not provided
  sessionMaxAge: parseInt(
    getEnvVar("SESSION_MAX_AGE", String(14 * 24 * 60 * 60 * 1000)),
    10
  ),
  clientOrigins: getEnvVar(
    "CLIENT_ORIGIN",
    "http://localhost:3000,http://127.0.0.1:3000"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
