import { generateAuthLink, login, setPassword } from "@/controllers/auth";
import { Router} from "express"

import{ emailValidationSchema, newUserSchema, validate } from "@/middleware/validator";
import { logout, sendProfileInfo, updateProfile } from "@/controllers/auth";
import { isAuth } from "@/middleware/isAuth";
import { fileParser } from "@/middleware/file";

const  authRouter = Router();



//generate authentcation link and send that link to user email address. 
authRouter.post('/generate-link',
validate(emailValidationSchema),  // middleware. 
generateAuthLink
);
// authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.post("/logout", isAuth, logout);
authRouter.post("/set-password", setPassword);
authRouter.post("/login", login);
authRouter.put("/profile", isAuth,fileParser, validate(newUserSchema), updateProfile);

export default authRouter;