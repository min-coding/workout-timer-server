import { Request, Response } from 'express';
import express from 'express';
import { Workout } from '../entity/Workout';
import { AppDataSource } from '../data-source';
import { Routine } from '../entity/Routine';

const workoutRouter = express.Router();
const routineRepository = AppDataSource.getRepository(Routine);
const workoutRepository = AppDataSource.getRepository(Workout);

async function updateRoutineTotalTime(routine) {
  const routineRepository = AppDataSource.getRepository(Routine);

  //call routine and join it with workout to retrieve the workouts then sum them into totalDuration
  const totalDuration = await routineRepository
    .createQueryBuilder('routine')
    .leftJoin('routine.workouts', 'workout')
    .select('SUM(workout.duration)', 'totalDuration')
    .where('routine.routine_id = :routineId', {
      routineId: routine.routine_id,
    })
    .getRawOne();

  if (routine) {
    //if totalDuration is undefined, which is probably no workout inside a routine? return 0
    routine.total_time = totalDuration?.totalDuration || 0;
    await routineRepository.save(routine);
  }
}

// API route for creating a new workout
workoutRouter.post('/:routineId', async function (req: Request, res: Response) {
  try {
    // Get the routine ID from the request params
    const routineId = Number(req.params.routineId);

    // Find the routine using the routine ID
    const routine = await routineRepository.findOneBy({
      routine_id: routineId,
    });

    // Create a new instance of Workout
    const workout = new Workout();
    workout.workout_name = req.body.workout_name;
    workout.duration = req.body.duration;
    workout.routine = routine;

    // Save the workout to the database
    const savedWorkout = await workoutRepository.save(workout);

    // Update the routine's total_time
    await updateRoutineTotalTime(routine);

    // Send the saved workout as the response
    res.send(savedWorkout);
  } catch (error) {
    // Handle any errors
    console.log(error);
  }
});

// API route for updating a workout
workoutRouter.put('/:workoutId', async function (req: Request, res: Response) {
  try {
    const workout = await workoutRepository.findOneBy({
      workout_id: Number(req.params.workoutId),
    });
    const routine = workout.routine;

    const { workout_name, duration } = req.body;

    // Update workout properties
    if (workout_name) workout.workout_name = workout_name;
    if (duration) workout.duration = duration;

    // Save the updated workout to the database
    const updatedWorkout = await workoutRepository.save(workout);

    // Update the routine's total_time
    await updateRoutineTotalTime(routine);

    return res.send(updatedWorkout);
  } catch (error) {
    return res.status(500).send('Internal server errors');
  }
});

// API route for deleting a workout
workoutRouter.delete(
  '/:workoutId',
  async function (req: Request, res: Response) {
    try {
      const workout = await workoutRepository.findOneBy({
        workout_id: Number(req.params.workoutId),
      });
      const routine = workout.routine;

      // Delete the workout from the database
      await workoutRepository.delete(req.params.workoutId);

      // Update the routine's total_time
      await updateRoutineTotalTime(routine);

      return res.status(200).send({ message: 'Workout deleted successfully' });
    } catch (error) {
      return res.send(500).send({ message: 'Unable to delete the workout' });
    }
  }
);

export default workoutRouter;
