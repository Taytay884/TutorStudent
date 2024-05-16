import { Schema, Document, model } from 'mongoose';
import { MatchStatus } from './match.type';

export interface IMatch extends Document {
  name: string;
  id: string;
}

export const MatchSchema = new Schema({
  tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor' },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  dateMatched: { type: Date, default: Date.now },
  requiredHours: { type: Number, required: true },
  approvedHours: { type: Number, default: 0 },
  status: { type: String, default: MatchStatus.PENDING },
});

export const Match = model<IMatch>('Match', MatchSchema);