import { generateAuthLink } from "@/controllers/auth";
import {Router} from "express"
import {z} from "zod";


const  authRouter = Router();

const schema = z.object({
    email:z
})



//generate authentcation link and send that link to user email address. 
authRouter.post('/generate-link',(req,res,next)=>{
    const {email} = req.body;
    const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

    if(!regex.test(email)){
        return res.status(422).json({error:"Invalid email address"})
    }

    next();
},generateAuthLink)
// authRouter.post('/auth/verify', (req, res)=>{
  
// })
// authRouter.post('/auth/profile', (req, res)=>{
  
// })

export default authRouter;