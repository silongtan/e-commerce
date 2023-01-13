import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();

// TODO
router.get('/user', (req: Request, res: Response) => {
  console.log(req.user)
  res.status(200).json(req.user || null);
});

export default router;
