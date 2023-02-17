import mongoose, { Document, Model } from 'mongoose';
import { OrderStatus } from '../enums/OrderStatus';
// import { ConfirmStatus } from '../enums/ConfirmStatus';
interface IOrder {
  customerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  status: OrderStatus;
  // confirm_status: ConfirmStatus;
  total_amount: number;
  orderItems: OrderItem[];
}
export interface CartItem {
  productId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  title: string;
  quantity: number;
  unitPrice: number;
}

export type OrderItem = Omit<CartItem, 'sellerId'>;
export interface IOrderModel extends IOrder, Document {}

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: Number,
      enum: OrderStatus,
      required: true,
      default: OrderStatus.Pending, // order init
    },
    total_amount: {
      type: Number,
      required: true,
      min: [0, 'You must provide price greater than 0.'],
    },
    orderItems: {
      type: [
        {
          productId: {
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
              message: '{VALUE} is not an integer value or not positive',
            },
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrderModel>('Order', orderSchema);
