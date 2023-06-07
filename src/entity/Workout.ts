import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';
import { Routine } from './Routine';
import { AppDataSource } from '../data-source';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  workout_id: number;

  @Column({
    nullable: false,
  })
  workout_name: string;

  @Column({
    nullable: false,default:0
  })
  duration: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**Relationship */
  @ManyToOne(() => Routine, (routine) => routine.workouts, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'routine_id' })
  routine: Routine;
}