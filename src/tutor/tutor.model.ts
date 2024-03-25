import { Schema, Document, model } from 'mongoose';

export interface ITutor extends Document {
  name: string;
  id: string;
  email: string;
  phone: string;
  hoursToGive: number;
  courses: string[];
}

export const TutorSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  hoursToGive: { type: Number, required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
});

export const Tutor = model<ITutor>('Tutor', TutorSchema);