import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import path from 'path';

//specifying entity path based on file path
let entitiesPath = path.resolve(__dirname, 'entity/*{.js,.ts}');
if (__dirname.includes('build')) {
  entitiesPath = path.resolve(__dirname, '../build/entity/*{.js,.ts}');
}
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workout_timer',
  synchronize: true,
  logging: false,
  entities: [entitiesPath],
  migrations: [],
});
