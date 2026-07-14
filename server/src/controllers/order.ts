import { BookDoc } from "@/models/book";
import OrderModel from "@/models/order";
import { RequestHandler } from "express";
import UserModel from "@/models/user";
import { sendErrorResponse } from "@/utils/helper";
import { isValidObjectId } from "mongoose";

export const getOrders: RequestHandler = async (req, res) => {
  const orders = await OrderModel.find({
    userId: req.user.id,
  })
    .populate<{
      orderItems: {
        id: BookDoc;
        price: number;
        qty: number;
        totalPrice: number;
      }[];
    }>("orderItems.id")
    .sort("-createdAt");

  res.json({
    orders: orders.map((order) => ({
      id: order._id,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount
        ? ((order.totalAmount ?? 0)/ 100).toFixed(2)
        : "0.00",
      date: order.createdAt,

      orderItems: order.orderItems.map(
        ({ id: book, qty, price, totalPrice }) => ({
          id: book._id,
          title: book.title,
          slug: book.slug,
          cover: book.cover?.url,
          qty,
          price: (price / 100).toFixed(2),
          totalPrice: (totalPrice / 100).toFixed(2),
        })
      ),
    })),
  });
};

interface Params {
  bookId: string;
}

export const getOrderStatus: RequestHandler<Params> = async (req, res) => {
  const { bookId } = req.params;

  let status = false;

  if (!isValidObjectId(bookId)) {
    return res.json({ status });
  }

  const user = await UserModel.findOne({
    _id: req.user.id,
    books: bookId,
  });

  if (user) status = true;

  res.json({ status });
};



export const getOrderSuccessStatus: RequestHandler = async (req, res) => {
  const { orderId } = req.body;

  if (!isValidObjectId(orderId)) {
    return sendErrorResponse({
      res,
      status: 400,
      message: "Invalid order id",
    });
  }

  const order = await OrderModel.findOne({
    _id: orderId,
    userId: req.user.id,
    paymentStatus: "paid",
  }).populate<{
    orderItems: {
      id: BookDoc;
      price: number;
      qty: number;
      totalPrice: number;
    }[];
  }>("orderItems.id");

  if (!order) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Order not found",
    });
  }

  res.json({
    success: true,

    totalAmount: (order.totalAmount / 100).toFixed(2),

    orders: order.orderItems.map(
      ({ id: book, qty, price, totalPrice }) => ({
        id: book._id,
        title: book.title,
        slug: book.slug,
        cover: book.cover?.url,
        qty,
        price: (price / 100).toFixed(2),
        totalPrice: (totalPrice / 100).toFixed(2),
      })
    ),
  });
};