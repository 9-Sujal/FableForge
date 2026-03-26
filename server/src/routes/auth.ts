import { generateAuthLink } from "@/controllers/auth";
import { Router} from "express"

import{ emailValidationSchema, newUserSchema, validate } from "@/middleware/validator";
import { logout, sendProfileInfo, updateProfile, verifyAuthToken } from "@/controllers/auth";
import { isAuth } from "@/middleware/isAuth";
import { fileParser } from "@/middleware/file";

const  authRouter = Router();



//generate authentcation link and send that link to user email address. 
authRouter.post('/generate-link',
validate(emailValidationSchema),  // middleware. 
generateAuthLink
);
authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.post("/logout", isAuth, logout);
authRouter.put("/profile", isAuth,fileParser, validate(newUserSchema), updateProfile);

export default authRouter;