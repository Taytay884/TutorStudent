import { Express, Request, Response } from 'express';
import * as MatchLogic from './match.logic';
import { IMatch } from './match.model';

export function initMatchRoutes(app: Express) {
  app.get('/Matches', async (req: Request, res: Response) => {
    try {
      const Matches = await MatchLogic.getMatches();
      res.json(Matches);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/Match', async (req: Request, res: Response) => {
    try {
      const Match: IMatch = req.body;
      const newMatch = await MatchLogic.createMatch(Match);
      res.json(newMatch);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  app.delete('/Match/:id', async (req: Request, res: Response) => {
    try {
      const deletedMatch = await MatchLogic.deleteMatch(req.params.id);
      res.json(deletedMatch);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}