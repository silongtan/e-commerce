import express, { NextFunction, Request, Response } from 'express';
import CartController from '../controllers/CartController';
const router = express.Router();

// for buyer and visitor only!!!!
router.get('/cart', CartController.getCart());
router.post('/addCart', CartController.addOneItemToCart());
router.put('/updateCart/', CartController.updateCart());
router.delete('/deleteCart/:productId', CartController.deleteCart());
export default router;
