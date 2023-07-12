import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Workout } from './Workout';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  routine_id: number;

  @Column({
    nullable: false,
  })
  routine_name: string;

  @Column({ nullable: true, default: 0 })
  total_time: number;

  /** Relationship */
  //many routines --> one user
  @ManyToOne(() => User, (user) => user.routines, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  //column name
  @JoinColumn({ name: 'user_id' })
  //property name
  user: User;

  //one routine --> many workouts
  @OneToMany(() => Workout, (workout) => workout.routine, {
    cascade: ['insert', 'update', 'remove'],
  })
  workouts: Workout[];
}
