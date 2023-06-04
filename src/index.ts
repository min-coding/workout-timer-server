import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import * as express from 'express';
import { Request, Response } from 'express';

AppDataSource.initialize().then(async () => {
    console.log('initialized database!')
}).catch(error => console.log(error))

// create and setup express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const port = 8080;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});