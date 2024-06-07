import { Express, Request, Response } from 'express';
import { initCourseRoutes } from '../course/course.routes';
import { initMatchRoutes } from '../match/match.routes';
import { initProfileRoutes } from '../profile/profile.routes';

function initRoutes(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

  initProfileRoutes(app);
  initCourseRoutes(app);
  initMatchRoutes(app);
}

export { initRoutes };