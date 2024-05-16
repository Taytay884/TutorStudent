import { Express, Request, Response } from 'express';
import { initTutorRoutes } from '../tutor/tutor.routes';
import { initStudentRoutes } from '../student/student.routes';
import { initCourseRoutes } from '../course/course.routes';
import { initMatchRoutes } from '../match/match.routes';

function initRoutes(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

  initTutorRoutes(app);
  initStudentRoutes(app);
  initCourseRoutes(app);
  initMatchRoutes(app);
}

export { initRoutes };