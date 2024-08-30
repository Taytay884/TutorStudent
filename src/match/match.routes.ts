import { Express, Request, Response } from 'express';
import * as MatchLogic from './match.logic';
import { IMatch } from './match.model';

export function initMatchRoutes(app: Express) {
  app.get('/matches', async (req: Request, res: Response) => {
    try {
      const Matches = await MatchLogic.getMatches();
      res.json(Matches);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/match/:id', async (req: Request, res: Response) => {
    try {
      const Matches = await MatchLogic.getMatch(req.params.id);
      res.json(Matches);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/match', async (req: Request, res: Response) => {
    try {
      const Match: IMatch = req.body;
      const newMatch = await MatchLogic.createMatch(Match);
      res.json(newMatch);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  app.put('/match', async (req: Request, res: Response) => {
    try {
      const match: IMatch = req.body;
      const newMatch = await MatchLogic.updateMatch(match);
      res.json(newMatch);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  app.delete('/match/:id', async (req: Request, res: Response) => {
    try {
      const deletedMatch = await MatchLogic.deleteMatch(req.params.id);
      res.json(deletedMatch);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}