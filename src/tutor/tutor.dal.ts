import { ITutor, Tutor } from './tutor.model';

export async function createTutor(tutor: ITutor): Promise<ITutor> {
  return new Tutor(tutor).save();
}

export async function getTutorById(id: string): Promise<ITutor | null> {
  return Tutor.findById({ id });
}

export async function getTutors(): Promise<ITutor[]> {
  return Tutor.find();
}

export async function updateTutor(tutor: ITutor): Promise<ITutor | null> {
  return Tutor.findByIdAndUpdate(tutor._id, tutor, { new: true });
}

export async function deleteTutor(id: string): Promise<ITutor | null> {
  return Tutor.findByIdAndDelete(id);
}
