import express, { NextFunction, Request, Response } from 'express';
import User, { IUserModel } from '../models/User';
import { UserRole } from '../enums/UserRole';
import mongoose from 'mongoose';
import Order, { IOrderModel, CartItem, OrderItem } from '../models/Order';
import { OrderStatus } from '../enums/OrderStatus';
export default class OrderController {
  static placeOrder = () => {
    return async (req: Request, res: Response) => {
      const userId = req.user.id;
      const userRole: UserRole = req.user.roleType;
      const cart = (await User.findOne({ _id: userId })).cart;
      let newOrders: IOrderModel[] = [];
      let idQuantPairs;
      if (userRole === UserRole.Buyer) {
        idQuantPairs = OrderController.#buildPairsMap(cart);
        console.log(idQuantPairs);
        for (const [key, value] of idQuantPairs) {
          const newOrder: IOrderModel = new Order({
            customerId: userId,
            sellerId: key,
            total_amount: value.reduce(
              (sumSofar, orderItem) =>
                sumSofar + orderItem.quantity * orderItem.unitPrice,
              0
            ),
            orderItems: value,
            status: OrderStatus.Pending,
          });
          newOrders.push(newOrder);
          console.log('tttttt', newOrders);
        }
      } else if (userRole === UserRole.Seller) {
        const newOrder: IOrderModel = new Order({
          ...req.body,
          sellerId: userId,
          status: OrderStatus.Pending,
        });
        newOrders.push(newOrder);
      } else {
        const newOrder: IOrderModel = new Order({
          ...req.body,
          status: OrderStatus.Pending,
        });
        newOrders.push(newOrder);
      }

      for (const newOrder of newOrders) {
        newOrder
          .save()
          .then((order) => {
            req.session.cart = [];
            User.updateOne({ _id: req.user.id }, { $set: { cart: [] } })
              .then((re) => console.log('success'))
              .catch((e) => console.log(e));
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({ message: err.message });
          });
      }
      res.status(201).json(newOrders);
    };
  };
  static #buildPairsMap(
    cart: {
      productId: mongoose.Types.ObjectId;
      sellerId: mongoose.Types.ObjectId;
      title: string;
      quantity: number;
      unitPrice: number;
    }[]
  ) {
    const separateMap = new Map<mongoose.Types.ObjectId, OrderItem[]>();

    console.log(cart);
    cart.forEach(({ productId, title, quantity, sellerId, unitPrice }) => {
      const newItem: OrderItem = {
        productId: productId,
        title: title,
        quantity: quantity,
        unitPrice: unitPrice,
      };
      console.log(newItem);
      if (separateMap.has(sellerId)) {
        // console
        separateMap.get(sellerId).push(newItem);
      } else {
        separateMap.set(sellerId, [newItem]);
      }
    });

    console.log(separateMap);
    return separateMap;
  }
}
