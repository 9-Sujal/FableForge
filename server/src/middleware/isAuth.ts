import UserModel from "@/models/user";
import { IsPurchasedByTheUserHandler } from "@/types";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";


declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        name?: string;
        email: string;
        role: "user" | "author";
        avatar?: string;
        signedUp: boolean;
        authorId?: string;
        books?: string[];
      };
    }
  }
}


export const isAuth: RequestHandler = async (req, res, next) => {

//   console.log("Cookies:", req.cookies);
// console.log("Token:", req.cookies?.authToken);

   const authToken = req.cookies.authToken; //INSIDE COOKIE WE HAVE STORED THE TOKEN WHICH WE GOT FROM SERVER AFTER SUCCESSFULL LOGIN.
    //send error response if we dont have token in cookie.
   if(!authToken){
     return sendErrorResponse({
        message: "Unauthorized req!",
        status: 401, 
        res, 

     })
   }

//     console.log("Cookies:", req.cookies);
// console.log("Token:", req.cookies?.authToken);
   //otherwise find out if the token is valid or signed by this server or not.
   const payload = jwt.verify(authToken, process.env.JWT_SECRET || "") as {userId: string};

    //if tje token is valid find user from the payload
    // if the token is invalid it will throw error whih we can handle
    // from inside the error middleware in express.

    const user  = await UserModel.findById(payload.userId);
     if(!user){
        return sendErrorResponse({
            message: "User not found",
            status: 401, 
            res,
        }); 
     }

     req.user = formatUserProfile(user);
     next(); // if everything is fine then we will call next to pass the control to the next middleware or controller.

}; 


export const isAuthor: RequestHandler = async(req, res, next) =>{
  if(req.user.role === "author")next(); 

  else{
    sendErrorResponse({
       message:"Invalid request",
      res,
         status:401,
    });
  }
  
}

export const isPurchasedByTheUser: IsPurchasedByTheUserHandler = async (
  req,
  res,
  next
) => {
  const user = await UserModel.findOne({
    _id: req.user.id,
    books: req.body.bookId,
  });
  if (!user)
    return sendErrorResponse({
      res,
      message: "Sorry we didn't found the book inside your library!",
      status: 403,
    });

  next();
};