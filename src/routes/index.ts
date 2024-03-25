import { Express, Request, Response } from 'express';
import { initTutorRoutes } from '../tutor/tutor.routes';

function initRoutes(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

  initTutorRoutes(app);
}

export { initRoutes };