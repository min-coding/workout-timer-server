import { User } from '../entity/User';
import { Request, Response } from 'express';
import * as express from 'express';
import { AppDataSource } from '../data-source';
import { Routine } from '../entity/Routine';
import { Workout } from '../entity/Workout';

const routineRouter = express.Router();
const routineRepository = AppDataSource.getRepository(Routine);
const userRepository = AppDataSource.getRepository(User);
const workoutRepository = AppDataSource.getRepository(Workout);

interface UserDataType extends Request {
  user: {
    username: string;
    user_id: number;
    email: string;
  };
}

// create new routine
routineRouter.post('/', async function (req: UserDataType, res: Response) {
  try {
    //Find that user to get User object
    const user = await userRepository.findOneBy({ user_id: req.user.user_id });
    const routine = new Routine();
    /**
     * When you assign a User object to the user property of a Routine object, TypeORM will automatically create a foreign key constraint in the database that links the Routine object to the User object. This means that when you save the Routine object to the database, the User object will also be saved.
     */
    routine.user = user;
    routine.routine_name = req.body.routine_name;

    const { routine_name, total_time, routine_id } =
      await routineRepository.save(routine);
    return res.send({ routine_name, total_time, routine_id });
  } catch (error) {
    return res.send('cannot create new routine');
  }
});

//delete routine
routineRouter.delete(
  '/:routineId',
  async function (req: UserDataType, res: Response) {
    try {
      //find routine
      const routine = await routineRepository.findOneBy({
        routine_id: Number(req.params.routineId),
      });
      //check authorization
      if (routine.user.user_id === req.user.user_id) {
        const removedRoutine = await routineRepository.delete(
          req.params.routineId
        );
        return res.status(200).send(removedRoutine);
      } else {
        return res.send('You are unauthorized to delete this routine');
      }
    } catch (error) {
      return res.send('cannot delete routine');
    }
  }
);

//update routine name only
routineRouter.put(
  '/:routineId',
  async function (req: UserDataType, res: Response) {
    try {
      const routine = await routineRepository.findOneBy({
        routine_id: Number(req.params.routineId),
      });
      if (routine.user.user_id === req.user.user_id) {
        routineRepository.merge(routine, req.body);
        const updatedRoutine = await routineRepository.save(routine);
        const {
          routine_id,
          routine_name,
          total_time,
          user: { user_id, username, email },
        } = updatedRoutine;

        return res.send({
          routine_id,
          routine_name,
          total_time,
          user: { user_id, username, email },
        });
      } else {
        return res.send('You are not authorized ');
      }
    } catch (error) {
      return res.send('cannot find this routine');
    }
  }
);

//get workout list in specific routine
routineRouter.get('/:routineId', async function (req: Request, res: Response) {
  try {
    //get the routine id from param, get lists of workouts
    const workoutList = await workoutRepository
      .createQueryBuilder('workout')
      .select(['workout.workout_name', 'workout.workout_id'])
      .where('workout.routine_id = :routineId', {
        routineId: req.params.routineId,
      })
      .getMany();

    return res.status(200).send(workoutList);
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
});

//get all
routineRouter.get('/', async function (req: UserDataType, res: Response) {
  try {
    const routineLists = await routineRepository
      .createQueryBuilder('routine')
      .leftJoinAndSelect('routine.workouts', 'workout')
      .select([
        'routine.routine_name',
        'routine.routine_id',
        'routine.total_time',
        'workout',
      ])
      .where('routine.user_id = :userId', { userId: req.user.user_id })
      .getMany();
    return res.status(200).send(routineLists);
  } catch (error) {
    res.status(404).send('You have no routines');
  }
});

export default routineRouter;
