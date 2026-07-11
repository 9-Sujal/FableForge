
import { verifyPayment, handlePaymentFailure } from "@/controllers/payment";
import { isAuth } from "@/middleware/isAuth";
import { Router } from "express";
 
const paymentRouter = Router();
 
// called from frontend after successful Razorpay payment
paymentRouter.post("/verify", isAuth, verifyPayment);
 
// called from frontend if payment fails or is cancelled
paymentRouter.post("/failure", isAuth, handlePaymentFailure);
 
export default paymentRouter;
 