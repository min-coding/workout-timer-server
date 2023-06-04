import { AppDataSource } from "./data-source"
import { Request, Response } from 'express';
import userRouter from './routes/userRoutes';
import routineRouter from "./routes/routineRoutes";
import workoutRouter from "./routes/workoutRoutes";

import * as express from 'express';
import * as cors from 'cors';
import authRouter from "./routes/authRoutes";


AppDataSource.initialize().then(async () => {
    console.log('initialized database!')
}).catch(error => console.log(error))

// create and setup express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/routines', routineRouter);
app.use('/api/workouts', workoutRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});