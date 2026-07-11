import { model, Types, Schema } from "mongoose";

type OrderItem = {
  id: Types.ObjectId;
  price: number;
  qty: number;
  totalPrice: number;
};

interface OrderDocument {
  userId: Types.ObjectId;
  orderItems: OrderItem[];
  razorpayOrderId: string;    // replaces stripeCustomerId
  razorpayPaymentId: string;  // replaces paymentId
  totalAmount: number;
  paymentStatus: string;
  paymentErrorMessage: string;
  createdAt: Date;
}

const schema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    razorpayOrderId: String,    // Razorpay order id (rzp_order_xxx)
    razorpayPaymentId: String,  // Razorpay payment id (pay_xxx)
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentErrorMessage: String,
  },
  { timestamps: true }
);

// index for faster lookups
schema.index({ userId: 1 });
schema.index({ razorpayOrderId: 1 });

const OrderModel = model<OrderDocument>("Order", schema);
export default OrderModel;


// import { model, ObjectId, Schema } from "mongoose";

// type OrderItem = {
//   id: ObjectId;
//   price: number;
//   qty: number;
//   totalPrice: number;
// };

// interface OrderDocument {
//   userId: ObjectId;
//   orderItems: OrderItem[];
//   stripeCustomerId?: string;
//   paymentId?: string;
//   totalAmount?: number;
//   paymentStatus?: string;
//   paymentErrorMessage?: string;
//   createdAt: Date;
// }

// const schema = new Schema<OrderDocument>(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     orderItems: [
//       {
//         id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
//         price: { type: Number, required: true },
//         totalPrice: { type: Number, required: true },
//         qty: { type: Number, required: true },
//       },
//     ],
//     stripeCustomerId: String,
//     paymentId: String,
//     totalAmount: Number,
//     paymentStatus: String,
//     paymentErrorMessage: String,
//   },
//   { timestamps: true }
// );

// const OrderModel = model<OrderDocument>("Order", schema);
// export default OrderModel;
