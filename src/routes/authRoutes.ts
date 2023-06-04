import { User } from '../entity/User';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs';
import * as express from 'express';

const authRouter = express.Router();

export default authRouter;
