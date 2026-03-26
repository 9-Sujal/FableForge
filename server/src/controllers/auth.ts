import { Request,Response,RequestHandler  } from "express";
import crypto from 'crypto'
import UserModel from "@/models/user";
import VerificationTokenModel from "@/models/verificationToken";

import mail from "@/utils/mail";

export const generateAuthLink: RequestHandler = async (req: Request, res: Response) => {
   
   const {email} = req.body; 

   // bringing user from database if exist otherwise create a new user with that email.
   let user = await UserModel.findOne({email}); 
   if(!user){
      user = await UserModel.create({email}); 

   }

   const userId = user._id.toString();

   //if we alre/.ady have tokem for this user it will remove that first. 
   await VerificationTokenModel.findOneAndDelete({userId}); 
  

   //generate token and save in database.
   const randomToken = crypto.randomBytes(36).toString("hex");  


   await VerificationTokenModel.create({
      userId: user._id.toString(),
      token: randomToken,

   })

   //creating link 

// Looking to send emails in production? Check out our Email API/SMTP product!


const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&id=${user._id.toString()}`;

await mail.sendVerificationMail({
   link,
   to: email,
   name: user.name || user.email
})

res.json({message:"Verification link has been sent to your email address. Please check your email and click the link to login."});

}


// in this 
// we have to generate unique token for every users 
// store that token inside database
// create a link which include that secure token and user information
// notify user to look inside the email to get the login link. 


import { formatUserProfile, sendErrorResponse } from "@/utils/helper";


import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user:{
   id: string;
    name?: string | undefined;
    email: string;
    role: "user" | "author";
    avatar?: string | undefined;
    signedUp: boolean;
    authorId?: string | undefined;
    books?: string[] | undefined;
      }
    }
  }
}
 
// in this file we will verify the token which is sent to user email and also check if that token is valid or not.
// if the token is valid then we will generate a new token for user and send it to client and also delete the token from database.

export const verifyAuthToken: RequestHandler = async (req, res) =>{
    const {token, id: userId} = req.query;
    if(typeof token !== "string" || typeof userId !== "string"){
            return sendErrorResponse({
                status:400,
                message:"Invalid request",
                res,

            })
    }
 
     const verificationToken = await VerificationTokenModel.findOne({userId}); 

     if(!verificationToken || verificationToken.compare(token)){
        return sendErrorResponse({
            status:403,
            message:"invalid request",
            res,
        })
     }
   

     const user = await UserModel.findById(userId); 
     if(!user){
        return sendErrorResponse({
            status:500,
            message:"User not found",
            res,
        }); 
     }

     await VerificationTokenModel.findByIdAndDelete(verificationToken._id); 

    //  todo authentication

    const payload = {userId: user._id}; // payload for token generation

    const authToken = jwt.sign(payload, process.env.JWT_SECRET!,{
        expiresIn:"15d", 
    })

    const isDevModeOn = process.env.NODE_ENV === "development";
    res.cookie("authToken", authToken,{
        httpOnly:true,
        secure: !isDevModeOn, 
        sameSite: isDevModeOn ? "strict" : "none", 
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    }); 

    res.redirect(
        `${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(formatUserProfile(user))}`
    );


};
export const sendProfileInfo: RequestHandler = (req, res) => {
  res.json({
    profile: req.user,
  });
};

// in the below code we will clear the cookie which is set for authentication and logout the user.
// we will also check if the user is in development mode or not and set the cookie accordingly. if we are in development mode we
//  will set the cookie with sameSite as strict and secure as false otherwise we will set sameSite as none and secure as true. this is 
// because in development mode we are running our client and server on different ports and if we set sameSite as none then the cookie will 
// not be sent to the client. and in production mode we are running our client and server on different domains so we have to set sameSite as
//  none and secure as true to make sure that the cookie is sent to the client.
// we will also set the path of the cookie to "/" to make sure that the cookie is sent to all the routes in our application. if we do not set the path then the cookie will only be sent to the route which set the cookie and it will not be sent to other routes. so we have to set the path to "/" to make sure that the cookie is sent to all the routes in our application.
export const logout: RequestHandler = (req, res) => {
  const isDevModeOn = process.env.NODE_ENV === "development";
  res.clearCookie("authToken", {
      httpOnly: true,
      secure: !isDevModeOn,
      sameSite: isDevModeOn ? "strict" : "none",
      path: "/",
    })
    .send();
};

export const updateProfile: RequestHandler = async (req, res) => {
      const user =  await UserModel.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        signedUp: true,
      },
      {new:true});

      if(!user){
        return sendErrorResponse({
            res,
            message:"User not found",
            status:404,
        }); 

        //if there is any file upload them to cloud and update the database.

        
      }
}