import { isAuth } from "@/middleware/isAuth";
import { newAuthorSchema, validate } from "@/middleware/validator";
import { Router } from "express";


const authorRouter = Router(); 

// authorRouter.post("/register", isAuth, validate(newAuthorSchema), registerAuhtor); 

// authorRouter.patch("/", isAuth, isAuthor,validate(newAuthorSchema), updateAuthor); 

