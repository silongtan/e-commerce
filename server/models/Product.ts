import mongoose, { Document, Model } from "mongoose";
interface IProduct {
  sellerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  salePrice: number;
  isActive: boolean;
}

export interface IProductModel extends IProduct, Document {}

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: { type: String },
    salePrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (v: number) {
          return v > 0;
        },
        message: "You must provide price greater than 0.",
      },
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProductModel>("Product", productSchema);
