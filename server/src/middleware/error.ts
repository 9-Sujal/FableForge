import { ErrorRequestHandler } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { error } from "node:console";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
   if(err instanceof JsonWebTokenError){
    return res.status(401).json({error: err.message || "Unauthorized request!"});
   }
   res.status(500).json({error: err.message || "Internal Server Error!"});
};