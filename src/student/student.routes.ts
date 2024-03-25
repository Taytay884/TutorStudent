import { Express, Request, Response } from 'express';
import * as StudentLogic from './student.logic';
import { IStudent } from './student.model';

export function initStudentRoutes(app: Express) {
  app.get('/students', async (req: Request, res: Response) => {
    try {
      const students = await StudentLogic.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/student/:id', async (req: Request, res: Response) => {
    try {
      const student = await StudentLogic.getStudentById(req.params.id);
      res.json(student);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/student', async (req: Request, res: Response) => {
    try {
      const student: IStudent = req.body;
      const newStudent = await StudentLogic.createStudent(student);
      res.json(newStudent);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  app.put('/student', async (req: Request, res: Response) => {
    try {
      const student: IStudent = req.body;
      const updatedStudent = await StudentLogic.updateStudent(student);
      res.json(updatedStudent);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.delete('/student/:id', async (req: Request, res: Response) => {
    try {
      const deletedStudent = await StudentLogic.deleteStudent(req.params.id);
      res.json(deletedStudent);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}

