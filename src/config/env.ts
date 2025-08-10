import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  port: number;
  mongodbUri: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const envConfig: EnvConfig = {
  port: parseInt(getEnvVar("PORT", "3000"), 10),
  mongodbUri: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/mydatabase"),
};
