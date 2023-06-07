import { Request, Response } from 'express';
import * as express from 'express';
import { User } from '../entity/User';
import { Workout } from '../entity/Workout';
import { AppDataSource } from '../data-source';
import { Routine } from '../entity/Routine';

const workoutRouter = express.Router();
const routineRepository = AppDataSource.getRepository(Routine);
const workoutRepository = AppDataSource.getRepository(Workout);

interface UserSession extends Request {
  user: User;
  flash: Function;
}

//create workout
workoutRouter.post(
  '/:routineId',
  async function (req: UserSession, res: Response) {
    try {
      //get routine id to assign newly created workout to
      const routine = await routineRepository.findOneBy({
        routine_id: Number(req.params.routineId),
      });

      const workout = new Workout();
      workout.workout_name = req.body.workout_name;
      workout.duration = req.body.duration;
      workout.routine = routine;
      const savedWorkout = await workoutRepository.save(workout);

      //update total time 
      routine.total_time += workout.duration;

      await routineRepository.save(routine);
      //update total time from duration added

      return res.send(savedWorkout);
    } catch (error) {
      return res.send('cant create a workout');
    }
  }
)
//update workout time or name either
workoutRouter.put('/:workoutId',async function (req:UserSession,res:Response) {
  try {
    const workout = await workoutRepository.findOneBy({ workout_id: Number(req.params.workoutId) })

    const routine = workout.routine

    const {workout_name,duration} = req.body

    if (workout_name) workout.workout_name = workout_name
    if (duration) {
      //find the diff 
      
      const diff = Math.abs(duration - workout.duration)
      //if it's more than previous, add the diff
      if(duration > workout.duration) routine.total_time += diff
      else if(duration < workout.duration) routine.total_time -= diff
      
      workout.duration = duration
      await routineRepository.save(routine)
    }
    await workoutRepository.save(workout)
    return res.send(workout)
    
  } catch (error) {
    return res.send('cant updateeeee???? huhhh')
  }
})

//delete workout
workoutRouter.delete('/:workoutId', async function (req: UserSession, res: Response){
  try {
    const deleteWorkout = await workoutRepository.delete(req.params.workoutId)
    return res.send({message:'your workout is deleted!'})
  } catch (error) {
    return res.send({message:'cant delete this bro'})
  }
})

//get individual workout ?

export default workoutRouter;
