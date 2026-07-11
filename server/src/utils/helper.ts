import { BookDoc, FormattableBook } from "@/models/book";
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

export const generateS3ClientPublicUrl = (
  bucketName: string,
  uniqueKey: string
): string => {
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;
};

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const formatBook = (
  book: FormattableBook 
): FormattedBooks => {
  const { _id, title, slug, genre, price, cover, averageRating } = book;

  return {
    id: _id?.toString() || "",
    title: title,
    slug: slug,
    genre: genre,
    price: {
      mrp: (price.mrp / 100).toFixed(2),
      sale: (price.sale / 100).toFixed(2),
    },
    cover: cover?.url,
    rating: averageRating?.toFixed(1),
  };
};


