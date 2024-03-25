import { Express, Request, Response } from 'express';

function initRoutes(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });
}

export { initRoutes };