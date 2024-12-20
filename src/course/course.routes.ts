import { Express, Request, Response } from 'express';
import * as CourseLogic from './course.logic';
import { ICourse } from './course.model';
import { responseError } from '../utils/error';

export function initCourseRoutes(app: Express) {
  app.get('/courses', async (req: Request, res: Response) => {
    try {
      const courses = await CourseLogic.getCourses();
      res.json(courses);
    } catch (error) {
      responseError(res, error);
    }
  });

  app.post('/course', async (req: Request, res: Response) => {
    try {
      const course: ICourse = req.body;
      const newCourse = await CourseLogic.createCourse(course);
      res.json(newCourse);
    } catch (error: any) {
      responseError(res, error);
    }
  });

  app.put('/course', async (req: Request, res: Response) => {
    try {
      const course: ICourse = req.body;
      const updatedCourse = await CourseLogic.updateCourse(course);
      res.json(updatedCourse);
    } catch (error) {
      responseError(res, error);
    }
  });

  app.delete('/course/:id', async (req: Request, res: Response) => {
    try {
      const deletedCourse = await CourseLogic.deleteCourse(req.params.id);
      res.json(deletedCourse);
    } catch (error) {
      responseError(res, error);
    }
  });
}