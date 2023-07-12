import { AppDataSource } from './data-source';
import express from 'express';
import cors from 'cors';
import { User } from './entity/User';
// import https from 'https';
// import path from 'path';
// import fs from 'fs';
import dotenv from 'dotenv';

//Authen
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import setPassport from './passport-config';
import { isAuth } from './utils';

// Routes
import userRouter from './routes/userRoutes';
import routineRouter from './routes/routineRoutes';
import workoutRouter from './routes/workoutRoutes';

dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    console.log('initialized database!');
  })
  .catch((error) => console.log(error));

// create and setup express app
const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
const userRepository = AppDataSource.getRepository(User);

//authen
setPassport(
  passport,
  async function (email) {
    //return user with that email
    const user = await userRepository.findOneBy({ email: email });
    return user;
  },
  async function (id) {
    const user = await userRepository.findOneBy({ user_id: id });
    return user;
  }
);

app.use(
  session({
    secret: process.env.MY_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none',
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/routines', isAuth, routineRouter);
app.use('/api/workouts', isAuth, workoutRouter);

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
//   },
//   app
// );

// sslServer.listen(8080, () =>
//   console.log('secure server on port https://localhost:8080/')
// );
app.listen(8080, () => console.log(`running on http://localhost:8080`));
