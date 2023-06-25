import { User } from '../entity/User';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import * as passport from 'passport';
import * as bcrypt from 'bcryptjs';
import * as express from 'express';
import { isAuth } from '../utils';

const userRouter = express.Router();
const userRepo = AppDataSource.getRepository(User);

interface UserSession extends Request {
  user: User;
  flash: Function;
}

userRouter.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/api/users',
  }),
  (req, res: Response) => {
    res.status(200);
  }
);

userRouter.get('/', isAuth, (req: UserSession, res: Response) => {
  const { username, user_id, email } = req.user;
  try {
    res.status(200).send({ username, user_id, email });
  } catch (error) {
    res.send(req.flash().error);
  }
});

userRouter.put(
  '/profile/:userId',
  isAuth,
  async function (req: UserSession, res: Response) {
    try {
      const user = await userRepo.findOneBy({
        user_id: Number(req.params.userId),
      });
      const { username, password } = req.body;

      //update whatever is changed
      if (user) {
        if (username) user.username = username;
        if (password) {
          const hashedPassword = await bcrypt.hashSync(password);
          user.password = hashedPassword;
        }
        const updatedUser = await userRepo.save(user);
        console.log(updatedUser);
        return res.status(200).send({
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          email: updatedUser.email,
        });
      }
    } catch (error) {
      res.send('cannot update user');
    }
  }
);

userRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hashSync(password);
    const user = userRepo.create({ username, password: hashedPassword, email });
    const savedUser = await userRepo.save(user);
    console.log(`saved user ${savedUser}`);
    return res.status(200).send({ message: 'Create user successful' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'An error occurred' });
  }
});

export default userRouter;
