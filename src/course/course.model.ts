import { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  id: string;
}

export const CourseSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
});