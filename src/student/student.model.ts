import { Schema, Document, model } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  id: string;
  email: string;
  phone: string;
  hoursToGet: number;
  courses: string[];
}

export const StudentSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  hoursToGet: { type: Number, required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
});

export const Student = model<IStudent>('Student', StudentSchema);