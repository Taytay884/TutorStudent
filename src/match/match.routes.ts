import { Express, Request, Response } from 'express';
import * as MatchLogic from './match.logic';
import { IMatch } from './match.model';
import { GetMatchesFilter } from './match.type';
import { responseError } from '../utils/error';

export function initMatchRoutes(app: Express) {
  app.get('/matches', async (req: Request<unknown, unknown, unknown, GetMatchesFilter>, res: Response) => {
    try {
      const Matches = await MatchLogic.getMatches(req.query);
      res.json(Matches);
    } catch (error) {
      responseError(res, error);
    }
  });

  app.get('/match/:id', async (req: Request, res: Response) => {
    try {
      const Matches = await MatchLogic.getMatch(req.params.id);
      res.json(Matches);
    } catch (error) {
      responseError(res, error);
    }
  });

  app.post('/match', async (req: Request, res: Response) => {
    try {
      const Match: IMatch = req.body;
      const newMatch = await MatchLogic.createMatch(Match);
      res.json(newMatch);
    } catch (error: any) {
      responseError(res, error);
    }
  });

  app.put('/match', async (req: Request, res: Response) => {
    try {
      const match: IMatch = req.body;
      const newMatch = await MatchLogic.updateMatch(match);
      res.json(newMatch);
    } catch (error: any) {
      responseError(res, error);
    }
  });

  app.delete('/match/:id', async (req: Request, res: Response) => {
    try {
      const deletedMatch = await MatchLogic.deleteMatch(req.params.id);
      res.json(deletedMatch);
    } catch (error) {
      responseError(res, error);
    }
  });
}