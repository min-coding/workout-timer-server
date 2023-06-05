// import * as express from 'express';
import { Request, Response } from 'express';

function isAuth(req, res: Response, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return next()
}

export { isAuth };
