import { Request,Response,RequestHandler  } from "express";
import crypto from 'crypto'
import UserModel from "@/models/user";
import VerificationTokenModel from "@/models/verificationToken";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";


import jwt from "jsonwebtoken";
// import { PutObjectCommand } from "@aws-sdk/client-s3";

import { updateAvatarToAws } from "@/utils/fileIpload";


import mail from "@/utils/mail";
import slugify from "slugify"

export const tryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};


export const generateAuthLink: RequestHandler =tryCatch (async (req: Request, res: Response) => {
   
   const {email} = req.body; 

   // bringing user from database if exist otherwise create a new user with that email.
   const existingUser = await UserModel.findOne({ email });
   if (existingUser) {
    return sendErrorResponse({
        res,
        status: 409,
        message: "Email already registered",
    });
}
  //  if(!user){
  //     user = await UserModel.create({email}); 

  //  }

 await VerificationTokenModel.findOneAndDelete({ email });

const token = crypto.randomBytes(36).toString("hex");

await VerificationTokenModel.create({
    email,
    token,
});

   

   //creating link 

// Looking to send emails in production? Check out our Email API/SMTP product!


const link = `${process.env.VERIFICATION_LINK}?email=${encodeURIComponent(email)}&token=${token}`;

await mail.sendVerificationMail({
   link,
   to: email,
   name: email,
})

res.json({message:"Verification link has been sent to your email address. Please check your email and click the link to login."});

})


// in this 
// we have to generate unique token for every users 
// store that token inside database
// create a link which include that secure token and user information
// notify user to look inside the email to get the login link. 



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

export const verifyAuthToken: RequestHandler = tryCatch(async (req, res) =>{
    const {token, email} = req.query;
     
    

    if(typeof token !== "string" || typeof email !== "string"){
            return sendErrorResponse({
                status:400,
                message:"Invalid request",
                res,

            })
    }
 
     const verificationToken = await VerificationTokenModel.findOne({email}); 

     
     if(!verificationToken || !verificationToken.compare(token)){

        return sendErrorResponse({
            status:403,
            message:"invalid token or expired token",
            res,
        })
     }


     return res.json({
    message: "Token valid",
    email,
    token,
  });
    //  const user = await UserModel.findById(email); 
    //  if(!user){
    //     return sendErrorResponse({
    //         status:500,
    //         message:"User not found",
    //         res,
    //     }); 
    //  }

    //  await VerificationTokenModel.findByIdAndDelete(verificationToken._id); 

    //  todo authentication
    

    // const payload = {userId: user._id}; // payload for token generation

    // const authToken = jwt.sign(payload, process.env.JWT_SECRET!,{
    //     expiresIn:"15d", 
    // })

    // const isDevModeOn = process.env.NODE_ENV === "development";
    // res.cookie("authToken", authToken,{
    //     httpOnly:true,
    //     secure: !isDevModeOn, 
    //     sameSite: isDevModeOn ? "strict" : "none", 
    //     maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    // }); 
// res.cookie("authToken", authToken, {
//   httpOnly: true,
//   secure: false,       
//   sameSite: "lax",    
//   maxAge: 15 * 24 * 60 * 60 * 1000,
// });
//     res.redirect(
//         `${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(formatUserProfile(user))}`
//     );


}
)

export const setPassword: RequestHandler = tryCatch(async(req, res) =>{
  const {email, token, password} = req.body; 
 

  const verificationToken = await VerificationTokenModel.findOne({email});
  if(!verificationToken || !verificationToken.compare(token)){
   
    return sendErrorResponse({
      status:403,
      message:"invalid token or expired token",
      res,
    })
  }

  const existingUser = await UserModel.findOne({email}); 
if (existingUser) {
  return sendErrorResponse({
    res,
    status: 409,
    message: "User already exists",
  });
}
const user = await UserModel.create({
  email,
  password,
  signedUp: true,
});

  await VerificationTokenModel.deleteOne(verificationToken._id);  


  res.json({
    message:"Password set successfully. You can now login with your password.",
  })


  
})


export const login: RequestHandler = tryCatch(async(req, res) =>{
  const {email, password} = req.body;
 

  const user = await UserModel.findOne({email});

  if(!user || !user.password){

    return sendErrorResponse({
      status:404,
      message:"User not found or password not set",
      res,
    })
  
  
  }
  const isMatch = await user.comparePassword(password);
  
  if(!isMatch){
  
    return sendErrorResponse({
      status:401,
      message:"Incorrect password",
      res,
    })

  }
 
  const token = jwt.sign(
    {userId: user._id.toString()},
    process.env.JWT_SECRET!,
    {expiresIn:"15d"}
  );

 const isProduction = process.env.NODE_ENV === "production";

res.cookie("authToken", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 15 * 24 * 60 * 60 * 1000,
  path: "/",
});

  res.json({
    message:"Login successful",
   
  })

}
)


export const sendProfileInfo: RequestHandler = (req, res) => {
  res.json({
    profile: req.user,
  });
}





// in the below code we will clear the cookie which is set for authentication and logout the user.
// we will also check if the user is in development mode or not and set the cookie accordingly. if we are in development mode we
//  will set the cookie with sameSite as strict and secure as false otherwise we will set sameSite as none and secure as true. this is 
// because in development mode we are running our client and server on different ports and if we set sameSite as none then the cookie will 
// not be sent to the client. and in production mode we are running our client and server on different domains so we have to set sameSite as
//  none and secure as true to make sure that the cookie is sent to the client.
// we will also set the path of the cookie to "/" to make sure that the cookie is sent to all the routes in our application. if we do not set the path then the cookie will only be sent to the route which set the cookie and it will not be sent to other routes. so we have to set the path to "/" to make sure that the cookie is sent to all the routes in our application.
export const logout: RequestHandler = (req, res) => {
 const isProduction = process.env.NODE_ENV === "production";
res.clearCookie("authToken", {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
})
    .send();
};

export const updateProfile: RequestHandler = tryCatch(async (req, res) => {

  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      signedUp: true,
    },
    {
      new: true,
    }
  );

  if (!user)
    return sendErrorResponse({
      res,
      message: "Something went wrong user not found!",
      status: 500,
    });

  // if there is any file upload them to cloud and update the database
  const file = req.files.avatar;
  if (file && !Array.isArray(file)) {
    // if you are using cloudinary this is the method you should use
    // user.avatar = await updateAvatarToCloudinary(file, user.avatar?.id);

    // if you are using aws this is the method you should use
    const uniqueFileName = `${user._id}-${slugify(req.body.name, {
      lower: true,
      replacement: "-",
    })}.png`;
    user.avatar = await updateAvatarToAws(
      file as any,
      uniqueFileName,
      user.avatar?.id
    );

    await user.save();
 
  }

  res.json({ profile: formatUserProfile(user) });
}
)
