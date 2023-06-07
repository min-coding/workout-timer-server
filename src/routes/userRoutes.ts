import { User } from "../entity/User";
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs'
import * as express from 'express'
import { isAuth } from "../utils";
import * as passport from 'passport';

const userRouter = express.Router()
const userRepo = AppDataSource.getRepository(User)

interface UserSession extends Request {
  user: User
  flash: Function
}

userRouter.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/api/users',
    failureRedirect: '/api/users',
    failureFlash: true,
  })
);

userRouter.get('/', isAuth, (req: UserSession, res: Response) => {
  try {
    res.send(`Congrats ${req.user.username} logins successful`);
  } catch (error) {
    res.send(req.flash().error)
  }
});


userRouter.post('/signup', (async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hashSync(password);
    const user = userRepo.create({ username, password: hashedPassword, email });
    const savedUser = await userRepo.save(user);
    return res.send(savedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'An error occurred' });
  }
}))

export default userRouter