import express from 'express';
import authApi from './auth';
import productApi from './product';
import userApi from './user';
import orderApi from './order';
import cartApi from './cart';

const router = express.Router();

router.use('/', authApi);
router.use('/', productApi);
router.use('/', userApi);
router.use('/', orderApi);
router.use('/', cartApi);

export default router;
