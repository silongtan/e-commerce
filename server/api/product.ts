import express from "express";
import Product, { IProductModel } from "../models/Product";
import {
  requireAuthentication,
  forwardAuthenticated,
} from "../middlewares/authCheck";
import { UserRole } from "../enums/UserRole";
import mongoose from "mongoose";
const router = express.Router();

// get to view all available products,
router.route("/products").get(async (req, res) => {
  try {
    const allProducts = await Product.find({ isActive: true });
    res.status(200).json(allProducts);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.route("/myproducts").get(
  requireAuthentication([UserRole.Seller, UserRole.Admin]),

  async (req, res) => {
    const userId = req.user.id;
    const userRole: UserRole = req.user.roleType;
    let allProducts;
    try {
      if (userRole === UserRole.Seller) {
        allProducts = Product.find({ sellerId: userId });
      } else if (userRole === UserRole.Admin) {
        allProducts = Product.find();
      }
      res.status(200).json(allProducts);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

router.route("/products/:productId").get(async (req, res) => {
  const productId = req.params.productId;
  // console.log(productId);
  try {
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });
    if (!product) {
      res.status(404).json({ status: "error", message: "no such product." });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post(
  "/addProduct",
  requireAuthentication([UserRole.Seller, UserRole.Admin]),
  (req, res) => {
    const userId = req.user.id;
    const userRole: UserRole = req.user.roleType;
    let newProduct: IProductModel;
    if (userRole === UserRole.Seller) {
      newProduct = new Product({ ...req.body, sellerId: userId });
    } else if (userRole === UserRole.Admin) {
      newProduct = new Product({ ...req.body });
    }
    newProduct
      .save()
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  }
);

router.put(
  "/updateProduct",
  requireAuthentication([UserRole.Seller, UserRole.Admin]),
  async (req, res) => {
    const userId = req.user.id;
    const userRole: UserRole = req.user.roleType;

    if (userRole === UserRole.Seller) {
      console.log({ _id: req.body._id, sellerId: userId })
      Product.updateOne(
        { _id: req.body._id, sellerId: userId },
        { ...req.body, _id: req.body._id, sellerId: userId }
      )
        .then((product) => {
          res.status(201).json(product);
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    } else if (userRole === UserRole.Admin) {
      Product.updateOne(
        { _id: req.body._id },
        { ...req.body, _id: req.body._id }
      )
        .then((product) => {
          res.status(201).json(product);
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    }
  }
);

router.delete(
  "/deleteProduct/:productId",
  requireAuthentication([UserRole.Seller, UserRole.Admin]),
  async (req, res) => {
    const userId = req.user.id;
    const userRole: UserRole = req.user.roleType;
    const productId = req.params.productId;

    if (userRole === UserRole.Seller) {
      Product.deleteOne({ _id: productId, sellerId: userId })
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    } else if (userRole === UserRole.Admin) {
      Product.deleteOne({ _id: productId })
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    }
  }
);

export default router;
