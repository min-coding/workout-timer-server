import { User } from '../entity/User';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import express from 'express';
import { isAuth } from '../utils';

const userRouter = express.Router();
const userRepo = AppDataSource.getRepository(User);

interface UserDataType extends Request {
  user: {
    username: string;
    user_id: number;
    email: string;
  };
}

userRouter.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/api/users',
    failureRedirect: '/api/users/failure',
  })
);

userRouter.get('/failure', (req: Request, res: Response) => {
  res.header(
    'Access-Control-Allow-Origin',
    process.env.ORIGIN || 'http://127.0.0.1:5173'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.status(403).json(`Please check you email and password `);
});

userRouter.get('/', isAuth, (req: UserDataType, res: Response) => {
  const { username, user_id, email } = req.user;
  try {
    res.status(200).send({ username, user_id, email });
  } catch (error) {
    res.status(500).send('Interal server error');
  }
});

userRouter.put(
  '/profile/:userId',
  isAuth,
  async function (req: Request, res: Response) {
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
        return res.status(200).send({
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          email: updatedUser.email,
        });
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        let errorMessage = 'This username has been used.';
        return res.status(409).json({ error: errorMessage });
      }
      res.status(500).send('Interal server error');
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
    if (error.code === 'ER_DUP_ENTRY') {
      let errorMessage = '';

      if (error.sqlMessage.includes('@')) {
        errorMessage = 'This email has been used.';
      } else {
        errorMessage = 'This username has been used.';
      }
      return res.status(409).json({ error: errorMessage });
    }
  }
  return res.status(500).send('Interal server error');
});

userRouter.post('/signout', async (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.send(`logout!!`);
});

export default userRouter;
