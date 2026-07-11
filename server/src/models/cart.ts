import {Document, model, Schema, Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
}

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type:  Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type:  Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = model<CartDocument>("Cart", cartSchema);
export default CartModel;
