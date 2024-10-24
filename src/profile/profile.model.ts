import { Schema, Document, model } from 'mongoose';

enum Association {
  SMART_UP = 'SMART_UP',
  INDIVIDUAL = 'INDIVIDUAL',
}

export type TutorProfile = {
  firstName: string;
  lastName: string;
  hoursToGive: number;
  courses: string[];
  activeMatches: number;
  association: Association;
};

export interface IProfile extends Document {
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
  name?: string; // virtual
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

export const Profile = model<IProfile>('Profile', ProfileSchema);