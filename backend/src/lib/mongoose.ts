/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import configs from "@/configs";
import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";
import logger from "./winston";

const mongoClientOptions: ConnectOptions = {
  dbName: "quill-stack-db",
  appName: "QuillStack",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export async function connectToDB(): Promise<void> {
  if (!configs.DB_URI) {
    throw new Error("DB_URI is not defined in configs!");
  }

  try {
    const mongooseInstance = await mongoose.connect(
      configs.DB_URI,
      mongoClientOptions
    );
    logger.info(`Connected to MongoDB: ${mongooseInstance.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      logger.warn("Mongoose disconnected!");
    });
    mongoose.connection.on("error", (err) => {
      logger.error("Mongoose connection error:", err);
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    logger.error("Error connecting to MongoDB:", error);
  }
}

export async function disconnectFromDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB!", { options: mongoClientOptions });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    logger.error("Error disconnecting from MongoDB:", error);
  }
}
