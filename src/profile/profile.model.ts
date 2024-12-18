import { Schema, Document, model } from 'mongoose';

export enum Association {
  SMART_UP = 'SMART_UP',
  INDIVIDUAL = 'INDIVIDUAL',
  KOL_KORE = 'KOL_KORE',
  AFTER_DEGREE = 'AFTER_DEGREE',
}

export type TutorProfile = {
  firstName: string;
  lastName: string;
  hoursToGive: number;
  courses: string[];
  activeMatches: number;
  association: Association;
};

export interface IProfile {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  phone: string;
  hoursToGet: number;
  hoursToGive: number;
  courses: string[];
  reasons: string[];
  activeMatches?: number;
  association?: Association;
}

export const ProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  hoursToGet: { type: Number },
  hoursToGive: { type: Number },
  courses: [{ type: String, ref: 'Course' }],
  reasons: [{ type: String }],
  deactivation: { reason: { type: String }, from: { type: Date }, to: { type: Date } },
  association: { type: String, enum: Object.values(Association) },
});

export type IProfileDocument = IProfile & Document;
export const Profile = model<IProfileDocument>('Profile', ProfileSchema);