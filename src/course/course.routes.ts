import { Express, Request, Response } from 'express';
import * as CourseLogic from '../course/course.logic';
import { ICourse } from '../course/course.model';

export function initCourseRoutes(app: Express) {
  app.get('/courses', async (req: Request, res: Response) => {
    try {
      const courses = await CourseLogic.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/course', async (req: Request, res: Response) => {
    try {
      const course: ICourse = req.body;
      const newCourse = await CourseLogic.createCourse(course);
      res.json(newCourse);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  app.delete('/course/:id', async (req: Request, res: Response) => {
    try {
      const deletedCourse = await CourseLogic.deleteCourse(req.params.id);
      res.json(deletedCourse);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}