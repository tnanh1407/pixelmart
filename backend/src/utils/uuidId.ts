import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const uuidId = {
  type: String,
  default: uuidv4,
} as mongoose.SchemaDefinitionProperty<string>;
