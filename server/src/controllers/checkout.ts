import BookModel, { BookDoc } from "@/models/book";
import CartModel from "@/models/cart";
import OrderModel from "@/models/order";

import razorpay from "@/Razorpay";

import { sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";



// checkout from cart
export const checkout: RequestHandler = async (req, res) => {
  
  const { cartId } = req.body;

  if (!isValidObjectId(cartId)) {
    return sendErrorResponse({ res, message: "Invalid cart id!", status: 401 });
  }

  const cart = await CartModel.findOne({
    _id: cartId,
    userId: req.user.id,
  }).populate<{
    items: { product: BookDoc; quantity: number }[];
  }>({ path: "items.product" });

  if (!cart) {
    return sendErrorResponse({ res, message: "Cart not found!", status: 404 });
  }

  // check for unpublished books
  const hasUnpublished = cart.items.some(
    (item) => item.product.status === "unpublished"
  );
  if (hasUnpublished) {
    return sendErrorResponse({
      res,
      message: "Sorry, some books in your cart are no longer for sale!",
      status: 403,
    });
  }

  // calculate total in paise
  const totalAmount = cart.items.reduce((total, { product, quantity }) => {
    return total + product.price.sale * quantity;
  }, 0);

  // create order in DB first
  const newOrder = await OrderModel.create({
    userId: req.user.id,
    orderItems: cart.items.map(({ product, quantity }) => ({
      id: product._id,
      price: product.price.sale,
      qty: quantity,
      totalPrice: product.price.sale * quantity,
    })),
  });

  // create Razorpay order
  try{ 
  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount, // already in paise from your DB
    currency: "INR",
    receipt: `receipt_${newOrder._id.toString()}`,
    notes: {
      userId: req.user.id,
      orderId: newOrder._id.toString(),
      type: "checkout",
    },
    
  });



  // save razorpay order id to our order
  await OrderModel.findByIdAndUpdate(newOrder._id, {
    razorpayOrderId: razorpayOrder.id,
  });

  res.json({
    orderId: razorpayOrder.id,       // send to frontend to open modal
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    dbOrderId: newOrder._id,         // our internal order id
    keyId: process.env.RAZORPAY_KEY_ID,
  });
  }catch(err){
  
  console.dir(err, { depth: null });
}
};

// instant checkout — buy single book directly
export const instantCheckout: RequestHandler = async (req, res) => {
  const { productId } = req.body;

  if (!isValidObjectId(productId)) {
    return sendErrorResponse({
      res,
      message: "Invalid product id!",
      status: 401,
    });
  }

  const product = await BookModel.findById(productId);

  if (!product) {
    return sendErrorResponse({
      res,
      message: "Product not found!",
      status: 404,
    });
  }

  if (product.status === "unpublished") {
    return sendErrorResponse({
      res,
      message: "Sorry, this book is no longer for sale!",
      status: 403,
    });
  }

  // create order in DB
  const newOrder = await OrderModel.create({
    userId: req.user.id,
    orderItems: [
      {
        id: product._id,
        price: product.price.sale,
        qty: 1,
        totalPrice: product.price.sale,
      },
    ],
  });

  // create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: product.price.sale, // in paise
    currency: "INR",
    receipt: `receipt_${newOrder._id.toString()}`,
    notes: {
      userId: req.user.id,
      orderId: newOrder._id.toString(),
      type: "instant-checkout",
    },
  });

  await OrderModel.findByIdAndUpdate(newOrder._id, {
    razorpayOrderId: razorpayOrder.id,
  });

  res.json({
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    dbOrderId: newOrder._id,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
};