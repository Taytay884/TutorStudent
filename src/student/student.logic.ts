import * as StudentDal from './student.dal';
import { IStudent } from './student.model';
import { getMongoError } from '../utils/error';
import { GetStudentsFilter } from './student.type';

export async function createStudent(student: IStudent): Promise<IStudent> {
  try {
    return await StudentDal.createStudent(student);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export function getStudentById(id: string): Promise<IStudent | null> {
  return StudentDal.getStudentById(id);
}

export function getStudents(filter: GetStudentsFilter): Promise<IStudent[]> {
  return StudentDal.getStudents(filter);
}

export function updateStudent(student: IStudent): Promise<IStudent | null> {
  try {
    return StudentDal.updateStudent(student);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export function deleteStudent(id: string): Promise<IStudent | null> {
  return StudentDal.deleteStudent(id);
}


