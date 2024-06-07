import { Schema, Document, model } from 'mongoose';
import { MatchStatus } from './match.type';

export interface IMatch extends Document {
  name: string;
  id: string;
}

export const MatchSchema = new Schema({
  tutor: { type: Schema.Types.ObjectId, ref: 'Profile' },
  student: { type: Schema.Types.ObjectId, ref: 'Profile' },
  dateMatched: { type: Date, default: Date.now },
  hoursRequested: { type: Number, required: true },
  hoursApproved: { type: Number, default: 0 },
  status: { type: String, default: MatchStatus.PENDING },
});

export const Match = model<IMatch>('Match', MatchSchema);