import { IStudent, Student } from './student.model';

export async function createStudent(student: IStudent): Promise<IStudent> {
  return new Student(student).save();
}

export async function getStudentById(id: string): Promise<IStudent | null> {
  return Student.findById({ id }).populate('courses');
}

export async function getStudents(): Promise<IStudent[]> {
  return Student.find().populate('courses');
}

export async function updateStudent(student: IStudent): Promise<IStudent | null> {
  return Student.findByIdAndUpdate(student._id, student, { new: true });
}

export async function deleteStudent(id: string): Promise<IStudent | null> {
  return Student.findByIdAndDelete(id);
}
