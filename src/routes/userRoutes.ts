import { User } from "../entity/User";
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import * as passport from 'passport';
import * as bcrypt from 'bcryptjs'
import * as express from 'express'
import { isAuth } from "../utils";

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
  }),
  (req, res: Response) => {
    res.status(200);
  }
)

userRouter.get('/', isAuth,(req: UserSession, res: Response) => {
  const { username, user_id,email } = req.user; 
  try {
    res.send({username,user_id,email});
  } catch (error) {
    res.send(req.flash().error)
  }
})

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