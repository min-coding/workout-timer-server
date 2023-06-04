import { User } from "../entity/User";
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs'
import * as express from 'express'

const userRouter = express.Router()
const userRepo = AppDataSource.getRepository(User)

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