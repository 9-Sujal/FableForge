import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan"
import "./config/connect"
const app = express();

app.use(morgan("dev"));
app.use(cors({
    origin:[process.env.APP_URL!],
    credentials: true, 
}))

app.use(express.urlencoded({extended: false})) 
app.use(express.json());
app.use(cookieParser()); 

app.use("/auth",
    (req,res,next)=>{
        console.log("Auth Middleware");
        next();
    }
    ,authRouter);


const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
