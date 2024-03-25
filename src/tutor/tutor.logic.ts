import * as TutorDal from './tutor.dal';
import { ITutor } from './tutor.model';
import { getMongoError } from '../utils/error';

export async function createTutor(tutor: ITutor): Promise<ITutor> {
  try {
    return await TutorDal.createTutor(tutor);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export function getTutorById(id: string): Promise<ITutor | null> {
  return TutorDal.getTutorById(id);
}

export function getTutors(): Promise<ITutor[]> {
  return TutorDal.getTutors();
}

export function updateTutor(tutor: ITutor): Promise<ITutor | null> {
  try {
    return TutorDal.updateTutor(tutor);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export function deleteTutor(id: string): Promise<ITutor | null> {
  return TutorDal.deleteTutor(id);
}


