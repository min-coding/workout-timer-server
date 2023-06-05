// import * as express from 'express';
import { Request, Response } from 'express';

function isAuth(req, res: Response, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ message: `User is unauthorized` });
}

export { isAuth };
