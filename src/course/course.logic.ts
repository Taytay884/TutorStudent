import * as CourseDal from './course.dal';
import { ICourse } from './course.model';
import { getMongoError } from '../utils/error';

export async function createCourse(course: ICourse): Promise<ICourse> {
  try {
    return await CourseDal.createCourse(course);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export async function updateCourse(course: ICourse): Promise<ICourse | null> {
  try {
    return await CourseDal.updateCourse(course);
  } catch (error) {
    throw new Error(getMongoError(error));
  }
}

export async function getCourses(): Promise<ICourse[]> {
  return CourseDal.getCourses();
}

export async function deleteCourse(id: string): Promise<ICourse | null> {
  return CourseDal.deleteCourse(id);
}
