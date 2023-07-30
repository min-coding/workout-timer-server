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
import session from 'express-session';
const MySQLStore = require('express-mysql-session')(session);
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

app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.ORIGIN || 'http://127.0.0.1:5173',
    credentials: true,
  })
);

const storeOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workout_timer',
};

const sessionStore = new MySQLStore(storeOptions);

app.use(
  session({
    secret: process.env.MY_SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//run authen logic
const userRepository = AppDataSource.getRepository(User);
setPassport(
  passport,
  async function (email) {
    const user = await userRepository.findOneBy({ email: email });
    return user;
  },
  async function (id) {
    const user = await userRepository.findOneBy({ user_id: id });
    return user;
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello API');
});

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
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`running on PORT ${port}`));

//
