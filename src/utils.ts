// import * as express from 'express';
import { Request, Response } from 'express';

function isAuth(req, res: Response, next) {
  console.log(req.session)
  if (req.isAuthenticated()) {
    return next();
  }
  return res.send('You are unauthorized!')
}

export { isAuth };
