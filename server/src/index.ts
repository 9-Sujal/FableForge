import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth";

import cors from "cors"
import morgan from "morgan"
import "./config/connect"
import authorRouter from "./routes/author";
import bookRouter from "./routes/book";
import searchRouter from "./routes/search";
import reviewRouter from "./routes/review";
import paymentRouter from "./routes/payment";
import historyRouter from "./routes/history";
import cartRouter from "./routes/cart";
import orderRouter from "./routes/order";
import checkoutRouter from "./routes/checkout";
import cookieParser from "cookie-parser";

const app = express();

app.use(morgan("dev"));
app.use(cors({
    origin:[process.env.APP_URL!],
    credentials: true, 
}))
app.use(cookieParser()); 
app.use("/payment", paymentRouter );
app.use(express.urlencoded({extended: false})) 
app.use(express.json());


app.use("/auth",authRouter);
app.use("/author", authorRouter);
app.use("/book", bookRouter);
app.use("/search", searchRouter);
app.use("/review", reviewRouter);
app.use("/history", historyRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/order", orderRouter);

const port = process.env.PORT || 8989;
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FableForge API is running 🚀",
  });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
