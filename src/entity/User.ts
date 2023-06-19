import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import {Routine} from './Routine'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    length: 25,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Routine, (routine) => routine.user, { onUpdate: 'CASCADE' })
  routines: Routine[];
}
