import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth";


const app = express();

app.use(express.urlencoded({extended: false})) 
app.use(express.json());
app.use("/auth",
    (req,res,next)=>{
        console.log("Auth Middleware");
        next();
    }
    ,authRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
