import { UserDoc } from "@/models/user";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        name?: string;
        role: "user" | "author";
        avatar?: string;
        signedUp: boolean;
        authorId?: string;
        books?: string[];
    };
}

type ErrorResponseType = {
    res: Response, 
    message: string, 
    status: number
}

export const sendErrorResponse = ({
    res, 
    message, 
    status, 

}: ErrorResponseType): void => {
   res.status(status).json({ message }); 
}

//formatuserprofile
export const formatUserProfile = (user: UserDoc): AuthenticatedRequest["user"] => {
    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar?.url,
        signedUp: user.signedUp,
        authorId: user.authorId?.toString(),
        books: user.books?.map((b) => b.toString()) || [],

    }
}

interface FormattedBooks {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}