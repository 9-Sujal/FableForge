import CartModel from "@/models/cart";
import OrderModel from "@/models/order";
import UserModel from "@/models/user";
import { sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import crypto from "crypto";

export const verifyPayment: RequestHandler = async (req, res) => {
  const {
    dbOrderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return sendErrorResponse({
      res,
      status: 400,
      message: "Payment verification failed",
    });
  }

  // Find order
  const order = await OrderModel.findById(dbOrderId);

  if (!order) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Order not found!",
    });
  }

  // Prevent duplicate verification
  if (order.paymentStatus === "paid") {
    return res.json({
      success: true,
      message: "Order already verified.",
    });
  }

  // Calculate total
  const totalAmount = order.orderItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // Update order
  order.paymentStatus = "paid";
  order.razorpayOrderId = razorpay_order_id;
  order.razorpayPaymentId = razorpay_payment_id;
  order.totalAmount = totalAmount;

  await order.save();

  // Add books to user library
  const purchasedBooks = order.orderItems.map((item) => item.id);

  await UserModel.findByIdAndUpdate(req.user.id, {
    $addToSet: {
      books: { $each: purchasedBooks },
      orders: order._id,
    },
  });

  // Clear user's cart
  await CartModel.findOneAndUpdate(
    { userId: req.user.id },
    { items: [] }
  );

  res.json({
    success: true,
    orderId: order._id,
    message: "Payment verified successfully.",
  });
};

export const handlePaymentFailure: RequestHandler = async (req, res) => {
  const { dbOrderId, error } = req.body;

  if (dbOrderId) {
    await OrderModel.findByIdAndUpdate(dbOrderId, {
      paymentStatus: "failed",
      paymentErrorMessage:
        error?.description || "Payment failed",
    });
  }

  res.json({
    success: false,
    message: "Payment failed.",
  });
};

// import CartModel from "@/models/cart";
// import OrderModel from "@/models/order";
// import UserModel from "@/models/user";
// import { sendErrorResponse } from "@/utils/helper";
// import { RequestHandler } from "express";
// import crypto from "crypto";

// // called from frontend after Razorpay modal success
// export const verifyPayment: RequestHandler = async (req, res) => {
//   const {
//     dbOrderId,
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
    
//   } = req.body;

//   const generatedSignature = crypto
//    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//    .update(razorpay_order_id + "|" + razorpay_payment_id)
//    .digest("hex")

//    if(generatedSignature !== razorpay_signature){
//         return sendErrorResponse({
//       res,
//       status: 400,
//       message: "Payment verification failed",
//     });
//    }


 
//   const order = await OrderModel.findByIdAndUpdate(
//     dbOrderId,
//     {
//       razorpayPaymentId: razorpay_payment_id,
//       paymentStatus: "paid",
//       totalAmount: undefined, // will be updated below
//     },
//     { new: true }
//   );

//   if (!order) {
//     return sendErrorResponse({
//       res,
//       message: "Order not found!",
//       status: 404,
//     });
//   }

//   // calculate and save total amount
//   const totalAmount = order.orderItems.reduce(
//     (total, item) => total + item.totalPrice,
//     0
//   );
//   order.totalAmount = totalAmount;
//   await order.save();

//   // add books to user library + add order to user
//   const bookIds = order.orderItems.map((item) => item.id.toString());
//   await UserModel.findByIdAndUpdate(req.user.id, {
//     $addToSet: {
//       books: { $each: bookIds },
//       orders: { $each: [order._id] },
//     },
//   });

//   // if it was a cart checkout, clear the cart
//   if (req.body.type === "checkout") {
//     await CartModel.findOneAndUpdate({ userId: req.user.id }, { items: [] });
//   }

//   res.json({ success: true, message: "Payment verified and order placed!" });
// };

// // called from frontend if user cancels or payment fails
// export const handlePaymentFailure: RequestHandler = async (req, res) => {
//   const { dbOrderId, error } = req.body;

//   if (dbOrderId) {
//     await OrderModel.findByIdAndUpdate(dbOrderId, {
//       paymentStatus: "failed",
//       paymentErrorMessage: error?.description || "Payment failed",
//     });
//   }

//   res.json({ success: false, message: "Payment failed." });
// };