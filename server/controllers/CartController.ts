import { NextFunction, Request, Response } from 'express';
import User, { IUserModel } from '../models/User';
import { CartItem } from '../models/Order';
import mongoose from 'mongoose';

export default class CartController {
  static getCart = () => {
    return async (req: Request, res: Response) => {
      if (!req.isAuthenticated()) {
        res.status(201).json(req.session.cart);
      } else {
        try {
          const currentUser = await User.findOne({
            _id: req.user.id,
          });
          res.status(201).json(currentUser.cart);
        } catch (error) {
          res.status(500);
        }
      }
    };
  };
  // only unauthenticated user will go here, merge unlogin cart to login user database only!!!
  static addManyItemToCart = (
    tempCart: {
      productId: string;
      title: string;
      quantity: number;
      unitPrice: number;
      sellerId: string;
    }[],
    userId: string
  ) => {
    // console.log(tempCart);
    DBCartController.addManyItemToCart(tempCart, userId);
  };

  static addOneItemToCart = () => {
    return async (req: Request, res: Response) => {
      if (req.isAuthenticated()) {
        DBCartController.addOneItemToCart(req, res);
      } else {
        SessionCartController.addOneItemToCart(req, res);
      }
    };
  };
  static updateCart = () => {
    return async (req: Request, res: Response) => {
      // console.log(req.isAuthenticated())
      if (req.isAuthenticated()) {
        DBCartController.updateCart(req, res);
      } else {
        SessionCartController.updateCart(req, res);
      }
    };
  };

  static deleteCart = () => {
    return (req: Request, res: Response) => {
      if (req.isAuthenticated()) {
        DBCartController.deleteCart(req, res);
      } else {
        SessionCartController.deleteCart(req, res);
      }
    };
  };
}

class SessionCartController {
  static addOneItemToCart = async (req: Request, res: Response) => {
    const cart = req.session.cart;
    const { productId, quantity, title, sellerId, unitPrice } = req.body;
    if (cart.map((c) => c.productId).includes(productId)) {
      // if productId is already in the cart, add quantity
      cart.forEach((c) => {
        // console.log(c.productId, productId);
        if (c.productId === productId) {
          // console.log("updating", { ...c, quantity: c.quantity + quantity });
          return (c.quantity += Number(quantity));
        }
      });
      // console.log(cart);
    } else {
      cart.push({
        productId,
        title,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        sellerId,
      });
    }
    return res.status(201).json({ message: 'add to cart successfully. ' });
  };
  static updateCart = async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    let updateCount = 0;
    const cart = req.session.cart;
    req.session.cart.map((c) => {
      if (c.productId === productId) {
        // console.log(true);
        updateCount += 1;
        c.quantity = Number(quantity);
        // console.log({ ...c, quantity: Number(quantity) });
        // return { ...c, quantity: Number(quantity) };
      }
    });
    // console.log(req.session.cart);
    if (updateCount === 0) {
      res.status(400).json({
        error: 'update productId does not in your cart.',
      });
    } else {
      res.status(201).json({ message: 'update cart successfully. ' });
    }
  };
  static deleteCart = async (req: Request, res: Response) => {
    const cart = req.session.cart;
    const productId: string = req.params.productId;
    const productIndex = cart.map((c) => c.productId).indexOf(productId);
    if (productIndex != -1) {
      cart.splice(productIndex, 1);
      res.status(200).json({ message: 'delete cart successfully. ' });
    } else {
      res
        .status(404)
        .json({ message: 'no productId exists on shopping cart. ' });
    }
  };
}
class DBCartController {
  static addManyItemToCart = async (
    tempCart: {
      productId: string;
      title: string;
      quantity: number;
      unitPrice: number;
      sellerId: string;
    }[],
    userId: string
  ) => {
    console.log('dbconto', tempCart);
    const currentUser: IUserModel = await User.findOne({
      _id: userId,
    });
    tempCart.forEach(({ productId, title, quantity, unitPrice, sellerId }) => {
      const updatedIndex = currentUser.cart.findIndex((c) =>
        c.productId.equals(new mongoose.Types.ObjectId(productId))
      );
      if (updatedIndex !== -1) {
        currentUser.cart[updatedIndex].quantity += quantity;
      } else {
        currentUser.cart.push({
          productId: new mongoose.Types.ObjectId(productId),
          title,
          quantity,
          unitPrice,
          sellerId: new mongoose.Types.ObjectId(sellerId),
        });
      }
    });
    currentUser
      .save()
      .then((c) => console.log(c))
      .catch((e) => {
        throw e;
      });
  };
  static addOneItemToCart = async (req: Request, res: Response) => {
    const { productId, quantity, title, sellerId, unitPrice } = req.body;
    if (!productId && !quantity) {
      return res.status(400).json({ message: 'not valid input.' });
    }
    //   const cart = req.session.cart;
    let updateResult;
    let newCartItem: CartItem;
    const currentUser: IUserModel = await User.findOne({
      _id: req.user.id,
    });
    // console.log(req.user.id);
    // console.log(currentUser);
    if (currentUser.cart.map((c) => c.productId).includes(productId)) {
      currentUser.cart.forEach((c) => {
        // console.log(c.productId, productId);
        if (c.productId === productId) {
          // console.log("updating", { ...c, quantity: c.quantity + quantity });
          return (c.quantity += Number(quantity));
        }
      });
      currentUser
        .save()
        .then((user) => {
          res.status(201).json('add to cart successfully.');
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    } else {
      newCartItem = {
        productId,
        quantity,
        title,
        sellerId,
        unitPrice,
      };
      updateResult = await User.updateOne(
        { _id: req.user.id },
        { $push: { cart: newCartItem } }
      );
    }

    if (updateResult.matchedCount === 0) {
      res.status(400).json({
        error: 'add to cart not allowed',
      });
      return;
    } else {
      res.status(200).json({ status: 'ok', newCartItem: newCartItem });
    }
  };
  static updateCart = async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const updateResult = await User.updateOne(
      { _id: req.user.id, 'cart.productId': productId },
      { 'cart.$.quantity': quantity }
    );

    if (updateResult.matchedCount === 0) {
      res.status(400).json({
        error: 'update productId does not in your cart.',
      });
    } else {
      res.status(201).json({ message: 'update cart successfully. ' });
    }
  };
  static deleteCart = async (req: Request, res: Response) => {
    const productId: string = req.params.productId;
    const deleteResult = await User.updateOne(
      { _id: req.user.id },
      { $pull: { cart: { productId } } }
    );
    if (deleteResult.matchedCount === 0) {
      res.status(400).json({
        error: 'productId does not exist in your shopping cart. ',
      });
    } else {
      res.status(200).json({ status: 'delete ok' });
    }
  };
}
