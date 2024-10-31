import { Express, Request, Response } from 'express';
import * as ProfileLogic from './profile.logic';
import { IProfile } from './profile.model';
import { GetProfilesFilter } from './profile.type';
import { responseError } from '../utils/error';

export function initProfileRoutes(app: Express) {
  app.get('/profiles', async (req: Request<unknown, unknown, unknown, GetProfilesFilter>, res: Response) => {
    try {
      const profiles = await ProfileLogic.getProfiles(req.query);
      res.json(profiles);
    } catch (error) {
      responseError(res, error);
    }
  });

  app.get('/profile/:id', async (req: Request, res: Response) => {
    try {
      const profile = await ProfileLogic.getProfileById(req.params.id);
      res.json(profile);
    } catch (error) {
      responseError(res, error);
    }
  });

  app.post('/profile', async (req: Request, res: Response) => {
    try {
      const profile: IProfile = req.body;
      const newProfile = await ProfileLogic.createProfile(profile);
      res.json(newProfile);
    } catch (error: any) {
      responseError(res, error);
    }
  });

  app.put('/profile', async (req: Request, res: Response) => {
    try {
      const profile: IProfile = req.body;
      const updatedProfile = await ProfileLogic.updateProfile(profile);
      res.json(updatedProfile);
    } catch (error) {
      responseError(res, error);
    }
  });

  app.delete('/profile/:id', async (req: Request, res: Response) => {
    try {
      const deletedProfile = await ProfileLogic.deleteProfile(req.params.id);
      res.json(deletedProfile);
    } catch (error) {
      responseError(res, error);
    }
  });
}

