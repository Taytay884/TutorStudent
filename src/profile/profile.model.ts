import { Schema, Document, model } from 'mongoose';

export type TutorProfile = {
  name: string;
  hoursToGive: number;
  courses: string[];
  activeMatches: number;
};

export interface IProfile extends Document {
  name: string;
  id: string;
  email: string;
  phone: string;
  hoursToGet: number;
  hoursToGive: number;
  courses: string[];
  activeMatches?: number;
}

export const ProfileSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  hoursToGet: { type: Number },
  hoursToGive: { type: Number },
  courses: [{ type: String, ref: 'Course' }],
  reason: { type: String },
});

export const Profile = model<IProfile>('Profile', ProfileSchema);