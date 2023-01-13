import mongoose, { Document, Model } from 'mongoose';
import { UserRole } from '../enums/UserRole';
// import bcrypt from "bcrypt";
import { CartItem } from './Order';

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  username: string;
  // email: string;
  password: string;
  // img?: string;
  roleType: UserRole;
  isActive: boolean;
  cart: CartItem[];
}
export interface IUserModel extends IUser, Document {}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      // match: /^[\w][\w\-\.]*[\w]$/i,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roleType: {
      type: Number,
      enum: UserRole,
      required: true,
      default: UserRole.Buyer,
    },
    // email: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   lowercase: true,
    // },
    // img: {
    //   data: Buffer,
    //   contentType: String,
    // },orderItems: {
    cart: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            validate: {
              validator: (v: number) => {
                return Number.isInteger(v) && v > 0;
              },
              message: '{VALUE} is not an integer value or not positive',
            },
          },
          unitPrice: {
            type: Number,
            required: true,
            validate: {
              validator: (v: number) => {
                return v > 0;
              },
              message: '{VALUE} is not positive',
            },
          },
        },
      ],
      default: [
          // {
          //   productId: new mongoose.Types.ObjectId('000000000000000000000000'),
          //   sellerId: new mongoose.Types.ObjectId('000000000000000000000000'),
          //   title: 'a',
          //   quantity: 1,
          //   unitPrice: 0.1,
          // },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
