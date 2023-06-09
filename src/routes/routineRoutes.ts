import { User } from '../entity/User'
import { Request, Response } from 'express'
import * as express from 'express'
import { isAuth } from '../utils'
import { AppDataSource } from '../data-source'
import { Routine } from '../entity/Routine'
import { Workout } from '../entity/Workout'

const routineRouter = express.Router()
const routineRepository = AppDataSource.getRepository(Routine)
const userRepository = AppDataSource.getRepository(User)
const workoutRepository = AppDataSource.getRepository(Workout)

interface UserSession extends Request {
  user: User
  flash: Function
}

// create new routine
routineRouter.post('/', async function (req: UserSession, res: Response) {
  try {
    //Find that user to get User object
  const user = await userRepository.findOneBy({ user_id: req.user.user_id })
  const { routine_name } = req.body
  const routine = new Routine()
  /**
   * When you assign a User object to the user property of a Routine object, TypeORM will automatically create a foreign key constraint in the database that links the Routine object to the User object. This means that when you save the Routine object to the database, the User object will also be saved.
   */
  routine.user = user
  routine.routine_name = routine_name

  const savedRoutine = await routineRepository.save(routine)
  // console.log(savedRoutine)
  return res.send(savedRoutine)
  } catch (error) {
    return res.send('cannot create new routine')
  }
})

//delete routine
routineRouter.delete('/:routineId', async function (req: UserSession, res: Response) {
  try {
    //find routine
  const routine = await routineRepository.findOneBy({
    routine_id: Number(req.params.routineId)
  })
    //check authorization
    if (routine.user.user_id === req.user.user_id) {
      const removedRoutine = await routineRepository.delete(req.params.routineId)
      console.log(removedRoutine)
    
      return res.send(removedRoutine)
    }
    else {
      return res.send('You are unauthorized to delete this routine')
    }
  } catch (error) {
    console.log(error)
    return res.send('cannot delete routine')
  }
}) 


//update routine name only
routineRouter.put('/:routineId',async function(req:UserSession,res:Response) {
  try {
    const routine = await routineRepository.findOneBy({
      routine_id: Number(req.params.routineId),
    })
    if (routine.user.user_id === req.user.user_id) {
      routineRepository.merge(routine, req.body)
      const updatedRoutine = await routineRepository.save(routine)
      const { routine_id, routine_name, total_time, user: { user_id, username, email } } = updatedRoutine
      
      return res.send({routine_id,routine_name,total_time,user:{user_id,username,email}})
    } else {
      return res.send('You are not authorized ')
    }
  } catch (error) {
    return res.send('cannot find this routine')
  }
})

//get all routines from that user (routine lists)
routineRouter.get('/',async function (req:UserSession,res:Response) {
  try {
     const routineLists = await routineRepository
       .createQueryBuilder('routine')
       .select(['routine.routine_name', 'routine.routine_id'])
       .where('routine.user_id = :userId', { userId: req.user.user_id })
       .getMany()

     return res.send(routineLists)
  } catch (error) {
    res.send('you have no toutine')
    console.log('you have no routine!')
  }
})

//get workout list in specific routine
routineRouter.get(
  '/:routineId',
  async function (req: UserSession, res: Response) {
    try {
      //get the routine id from param, get lists of workouts
      const workoutList = await workoutRepository.createQueryBuilder('workout').select(['workout.workout_name', 'workout.workout_id']).where('workout.routine_id = :routineId', { routineId: req.params.routineId }).getMany()
      
      return res.send(workoutList)
    } catch (error) {
      return res.send('can get that list bro')
    }
  }
)
export default routineRouter
