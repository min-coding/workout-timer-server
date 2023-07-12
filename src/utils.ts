import { Request, Response } from 'express';

function isAuth(req, res: Response, next) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    if (req.session.flash.error) {
      if (req.session.flash.error.length > 1) {
        req.session.flash.error.shift();
      }
      return res.status(403).send(req.session.flash.error[0]);
    }
  } catch (error) {
    return next();
  }
}

export { isAuth };
