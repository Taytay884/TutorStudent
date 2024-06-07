import { Schema, Document, model } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  id: string;
  email: string;
  phone: string;
  hoursToGet: number;
  hoursToGive: number;
  courses: string[];
}

export const ProfileSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  hoursToGet: { type: Number },
  hoursToGive: { type: Number },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
});

export const Profile = model<IProfile>('Profile', ProfileSchema);