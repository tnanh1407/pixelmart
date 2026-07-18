import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProvince {
  _id?: string;
  code: string;
  name: string;
  nameEn?: string;
  fullName: string;
  fullNameEn?: string;
  codeName: string;
}

export interface IDistrict {
  _id?: string;
  code: string;
  name: string;
  nameEn?: string;
  fullName: string;
  fullNameEn?: string;
  codeName: string;
  provinceCode: string;
}

export interface IWard {
  _id?: string;
  code: string;
  name: string;
  nameEn?: string;
  fullName: string;
  fullNameEn?: string;
  codeName: string;
  districtCode: string;
}

const provinceSchema = new mongoose.Schema<IProvince>({
  _id: { type: String, default: uuidv4 },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: { type: String },
  fullName: { type: String, required: true },
  fullNameEn: { type: String },
  codeName: { type: String }
});

const districtSchema = new mongoose.Schema<IDistrict>({
  _id: { type: String, default: uuidv4 },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: { type: String },
  fullName: { type: String, required: true },
  fullNameEn: { type: String },
  codeName: { type: String },
  provinceCode: { type: String, required: true, index: true }
});

const wardSchema = new mongoose.Schema<IWard>({
  _id: { type: String, default: uuidv4 },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: { type: String },
  fullName: { type: String, required: true },
  fullNameEn: { type: String },
  codeName: { type: String },
  districtCode: { type: String, required: true, index: true }
});

export const Province = mongoose.model<IProvince>("Province", provinceSchema);
export const District = mongoose.model<IDistrict>("District", districtSchema);
export const Ward = mongoose.model<IWard>("Ward", wardSchema);
