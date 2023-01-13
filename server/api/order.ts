import express, { NextFunction, Request, Response } from 'express';
import Product, { IProductModel } from '../models/Product';
import Order, { IOrderModel, CartItem, OrderItem } from '../models/Order';
import {
  requireAuthentication,
  forwardAuthenticated,
} from '../middlewares/authCheck';
import { UserRole } from '../enums/UserRole';
import mongoose from 'mongoose';

import { OrderStatus } from '../enums/OrderStatus';
import OrderController from '../controllers/OrderController';
const router = express.Router();
router
  .route('/orders')
  .get(
    requireAuthentication([UserRole.Buyer, UserRole.Seller, UserRole.Admin]),
    async (req, res) => {
      const userId = req.user.id;
      const userRole: UserRole = req.user.roleType;
      let orders: IOrderModel[] = [];
      // console.log('userId from orders',userId)
      try {
        if (userRole === UserRole.Buyer) {
          orders = await Order.find({ customerId: userId });
        } else if (userRole === UserRole.Seller) {
          orders = await Order.find({ sellerId: userId });
        } else {
          orders = await Order.find();
        }
      } catch (error) {
        res.sendStatus(500).json({ message: error.message });
      }
      res.status(200).json(orders);
    }
  );

router
  .route('/orders/:orderId')
  .get(
    requireAuthentication([UserRole.Buyer, UserRole.Seller, UserRole.Admin]),
    async (req, res) => {
      const orderId = req.params.orderId;
      const userId = req.user.id;
      const userRole: UserRole = req.user.roleType;
      let order: IOrderModel;
      try {
        if (userRole === UserRole.Buyer) {
          order = await Order.findOne({ _id: orderId, customerId: userId });
        } else if (userRole === UserRole.Seller) {
          order = await Order.findOne({ _id: orderId, sellerId: userId });
        } else {
          order = await Order.findOne({ _id: orderId });
        }
      } catch (error) {
        res.sendStatus(500);
      }
      if (!order) {
        res.status(404).json({ message: 'no order with given orderId' });
      }
      res.status(201).json(order);
    }
  );
//TODO
router.post(
  '/addOrder',
  requireAuthentication([UserRole.Buyer, UserRole.Seller, UserRole.Admin]),
  OrderController.placeOrder()
);

router.put(
  '/orderChangeStatus/:orderId',
  requireAuthentication([UserRole.Buyer, UserRole.Seller, UserRole.Admin]),
  async (req, res) => {
    const userId = req.user.id;
    const userRole: UserRole = req.user.roleType;
    const newOrder: IOrderModel = req.body;
    // console.log('tttttttttttttt')
    console.log(newOrder);
    const condition: any = {
      _id: new mongoose.Types.ObjectId(req.params.orderId),
      status: {
        $in: [
          // because PUT is idempotent, ok to call PUT twice in a row with the existing state
          newOrder.status,
        ],
      },
    };
    switch (newOrder.status) {
      case OrderStatus.Processing: // seller accept
        condition.status.$in.push(OrderStatus.Pending);
        condition.sellerId = userId;
        break;
      case OrderStatus.Shipping: // seller shipped
        condition.status.$in.push(OrderStatus.Processing);
        condition.sellerId = userId;
        break;
      case OrderStatus.Completed: // seller shipped
        condition.status.$in.push(OrderStatus.Shipping);
        condition.customerId = userId;
        break;
      default:
        // invalid state
        res.status(400).json({ error: 'invalid state' });
        return;
    }

    const result = await Order.updateOne(condition, {
      $set: {
        status: newOrder.status,
      },
    });
    console.log(result);
    if (result.matchedCount === 0) {
      res
        .status(400)
        .json({ error: 'orderId does not exist or state change not allowed' });
      return;
    } else {
      res.status(200).json({ status: 'ok', newState: newOrder.status });
    }
  }
);
router.put(
  '/cancelOrder/:orderId',
  requireAuthentication([UserRole.Buyer, UserRole.Seller, UserRole.Admin]),
  async (req, res) => {
    const orderId = req.params.orderId;
    const userRole = req.user.roleType;
    const userId = req.user.id;
    const order: IOrderModel = await Order.findOne({ _id: orderId });
    let result;

    if (!order) {
      res.status(404).json({ orderId });
    } else {
      if (userRole === UserRole.Buyer && order.customerId === userId) {
        result = await Order.updateOne(
          { orderId, customerId: userId },
          { status: OrderStatus.Closed }
        );
      } else if (userRole === UserRole.Seller && order.sellerId === userId) {
        result = await Order.updateOne(
          { orderId, sellerId: userId },
          { status: OrderStatus.Closed }
        );
      } else {
        result = await Order.updateOne(
          { orderId },
          { status: OrderStatus.Closed }
        );
      }
    }
    if (result.matchedCount === 0) {
      res
        .status(400)
        .json({ error: 'orderId does not exist or state change not allowed' });
      return;
    }
    res.status(200).json({ status: 'ok' });
  }
);
export default router;
