import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

// console.log(`From datasource HOST ${process.env.DB_HOST}`);
// console.log(`From datasource PORT ${process.env.DB_PORT}`);
// console.log(`From datasource TYPE PORT ${typeof process.env.DB_PORT}`);
// console.log(`From datasource URL ${process.env.DB_URL}`);

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workout_timer',
  synchronize: true,
  logging: false,
  entities: ['src/entity/*{.js,.ts}'],
  migrations: [],
  subscribers: ['src/subscriber/*{.js,.ts}'],
});

// export const AppDataSource = new DataSource({
//   type: 'mysql',
//   url:process.env.DB_URL,
//   synchronize: true,
//   logging: false,
//   entities: ['src/entity/*{.js,.ts}'],
//   migrations: [],
//   subscribers: ['src/subscriber/*{.js,.ts}'],
// });
