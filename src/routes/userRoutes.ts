import { User } from "../entity/User";
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import * as passport from 'passport';
import * as bcrypt from 'bcryptjs'
import * as express from 'express'
import { isAuth } from "../utils";
<<<<<<< HEAD
=======
import * as passport from 'passport';
>>>>>>> 4df4e31 (something)

const userRouter = express.Router()
const userRepo = AppDataSource.getRepository(User)

<<<<<<< HEAD
<<<<<<< HEAD
interface UserSession extends Request {
  user: User
  flash:Function
=======
<<<<<<< Updated upstream
=======
=======
>>>>>>> 4df4e31 (something)
interface UserSession extends Request {
  user: User
  flash: Function
>>>>>>> 839ab5c (routine routes)
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


<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> 839ab5c (routine routes)
=======
>>>>>>> 4df4e31 (something)
userRouter.post('/signup', (async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hashSync(password);
    const user = userRepo.create({ username, password: hashedPassword, email });
    const savedUser = await userRepo.save(user);
    console.log(`saved user ${savedUser}`)
    return res.send(savedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'An error occurred' });
  }
}))

export default userRouter