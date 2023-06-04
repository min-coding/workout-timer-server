import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, AfterLoad, JoinColumn } from "typeorm";
import {User} from './User'
import { Workout } from "./Workout";

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  routine_id: number;

  @Column({
    nullable: false,
  })
  routine_name: string;

  @Column({
    nullable: false,
  })
  total_time: number;

  @AfterLoad()
  calculateTotalTime() {
    this.total_time = this.workouts.reduce(
      (total, workout) => total + workout.duration,
      0
    );
  }
  /** Relationship */
  //many routines --> one user
  @ManyToOne(() => User, (user) => user.routines,{nullable:false})
  @JoinColumn({ name: 'user_id' })
  user: User;

  //one routine --> many workouts
  @OneToMany(() => Workout, (workout) => workout.routine)
  workouts: Workout[];
}
