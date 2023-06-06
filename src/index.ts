import { AppDataSource } from "./data-source"
import * as express from 'express';
import * as cors from 'cors';
import { User } from "./entity/User";
import { Request, Response } from 'express';
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
=======
>>>>>>> 839ab5c (routine routes)

//Authen
import * as passport from 'passport'
import * as flash from 'express-flash';
import * as session from 'express-session';
import setPassport from "./passport-config";
<<<<<<< HEAD

// Routes
=======
import { isAuth } from "./utils";

// Routes
>>>>>>> Stashed changes
>>>>>>> 839ab5c (routine routes)
import userRouter from './routes/userRoutes';
import routineRouter from "./routes/routineRoutes";
import workoutRouter from "./routes/workoutRoutes";

AppDataSource.initialize().then(async () => {
    console.log('initialized database!')
}).catch(error => console.log(error))

// create and setup express app
const app = express()
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
=======
>>>>>>> 839ab5c (routine routes)
const port = 8080;
const userRepository = AppDataSource.getRepository(User);

//authen 
setPassport(passport, async function(email){
  //return user with that email
  const user = await userRepository.findOneBy({email:email})
  return user;
},async function(id){
  const user = await userRepository.findOneBy({user_id:id});
  return user;
});
app.use(flash())
app.use(
  session({
    secret: 'sessionSecret',
<<<<<<< HEAD
    resave: false,
=======
    resave: true,
>>>>>>> 839ab5c (routine routes)
    saveUninitialized: false,
  })
); 

app.use(passport.session()) 
app.use(passport.initialize())

<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> 839ab5c (routine routes)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/users', userRouter)
app.use('/api/routines',isAuth, routineRouter);
app.use('/api/workouts',isAuth, workoutRouter);

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});