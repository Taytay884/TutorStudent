import { Express, Request, Response } from 'express';
import * as TutorLogic from './tutor.logic';
import { ITutor } from './tutor.model';

export function initTutorRoutes(app: Express) {
  app.get('/tutors', async (req: Request, res: Response) => {
    try {
      const tutors = await TutorLogic.getTutors();
      res.json(tutors);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/tutor/:id', async (req: Request, res: Response) => {
    try {
      const tutor = await TutorLogic.getTutorById(req.params.id);
      res.json(tutor);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/tutor', async (req: Request, res: Response) => {
    try {
      const tutor: ITutor = req.body;
      const newTutor = await TutorLogic.createTutor(tutor);
      res.json(newTutor);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  app.put('/tutor', async (req: Request, res: Response) => {
    try {
      const tutor: ITutor = req.body;
      const updatedTutor = await TutorLogic.updateTutor(tutor);
      res.json(updatedTutor);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.delete('/tutor/:id', async (req: Request, res: Response) => {
    try {
      const deletedTutor = await TutorLogic.deleteTutor(req.params.id);
      res.json(deletedTutor);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}

