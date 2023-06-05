import { User } from '../entity/User';
import { Request, Response } from 'express';
import * as express from 'express';
import { isAuth } from '../utils';

const routineRouter = express.Router();

// routineRouter.get('/', isAuth, (req: UserSession, res: Response) => {
//   try {
//     res.send(`Congrats ${req.user.username} logins successful`);
//   } catch (error) {
//     res.send(req.flash().error);
//   }
// });

export default routineRouter;
