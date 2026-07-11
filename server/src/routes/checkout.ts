import { checkout, instantCheckout } from "@/controllers/checkout";
import { verifyPayment } from "@/controllers/payment";
import { isAuth } from "@/middleware/isAuth";

import { Router } from "express";

const checkoutRouter = Router();

checkoutRouter.post("/", isAuth, checkout);
checkoutRouter.post("/instant", isAuth, instantCheckout);
checkoutRouter.post("/verify", isAuth,verifyPayment)

export default checkoutRouter;
