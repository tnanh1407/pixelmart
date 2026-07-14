import mongoose from "mongoose";

export interface IProvince {
  code: string;
  name: string;
  nameEn?: string;
  fullName: string;
  fullNameEn?: string;
  codeName: string;
}

export interface IDistrict {
  code: string;
  name: string;
  nameEn?: string;
  fullName: string;
  fullNameEn?: string;
  codeName: string;
  provinceCode: string;
}

export interface IWard {
  code: string;
  name: string;
  nameEn?: string;
  fullName: string;
  fullNameEn?: string;
  codeName: string;
  districtCode: string;
}

const provinceSchema = new mongoose.Schema<IProvince>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: { type: String },
  fullName: { type: String, required: true },
  fullNameEn: { type: String },
  codeName: { type: String }
});

const districtSchema = new mongoose.Schema<IDistrict>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: { type: String },
  fullName: { type: String, required: true },
  fullNameEn: { type: String },
  codeName: { type: String },
  provinceCode: { type: String, required: true, index: true }
});

const wardSchema = new mongoose.Schema<IWard>({
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
