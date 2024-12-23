import { ICourse, Course } from './course.model';

export async function createCourse(course: ICourse): Promise<ICourse> {
  return new Course(course).save();
}

export async function updateCourse(course: ICourse): Promise<ICourse | null> {
  return Course.findByIdAndUpdate(course._id, course, { new: true });
}

export async function getCourses(): Promise<ICourse[]> {
  return Course.find().sort({ name: 1 });
}

export async function deleteCourse(id: string): Promise<ICourse | null> {
  return Course.findByIdAndDelete(id);
}
