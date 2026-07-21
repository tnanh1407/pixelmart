import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const provinceSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameEn: { type: String },
    fullName: { type: String, required: true },
    fullNameEn: { type: String },
    codeName: { type: String }
});
const districtSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameEn: { type: String },
    fullName: { type: String, required: true },
    fullNameEn: { type: String },
    codeName: { type: String },
    provinceCode: { type: String, required: true, index: true }
});
const wardSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameEn: { type: String },
    fullName: { type: String, required: true },
    fullNameEn: { type: String },
    codeName: { type: String },
    districtCode: { type: String, required: true, index: true }
});
export const Province = mongoose.model("Province", provinceSchema);
export const District = mongoose.model("District", districtSchema);
export const Ward = mongoose.model("Ward", wardSchema);
