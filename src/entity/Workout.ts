import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Routine } from './Routine';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  workout_id: number;

  @Column({
    nullable: false,
  })
  workout_name: string;

  @Column({
    nullable: false,
    default: 0,
  })
  duration: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**Relationship */
  @ManyToOne(() => Routine, (routine) => routine.workouts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'routine_id' })
  routine: Routine;
}
