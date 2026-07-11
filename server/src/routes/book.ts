import { createNewBook, deleteBook, generateBookAccessUrl, getAllPurchasedBooks, getBookByGenre, getBooksPublicDetails, getFeaturedBooks, getRecommendedBooks, updateBook } from "@/controllers/book";
import { fileParser } from "@/middleware/file";
import { isAuth, isAuthor } from "@/middleware/isAuth";
import { newBookSchema, updateBookSchema, validate } from "@/middleware/validator";
import { Router } from "express";


const bookRouter = Router();

bookRouter.post(
  "/create",
  isAuth,
  isAuthor,
  fileParser,
  validate(newBookSchema),
  createNewBook
);


bookRouter.patch(
  "/",
  isAuth,
  isAuthor,
  fileParser,
  validate(updateBookSchema),
  updateBook
);

bookRouter.get("/featured", getFeaturedBooks);
bookRouter.get("/list", isAuth, getAllPurchasedBooks);
bookRouter.delete("/:bookId", isAuth, isAuthor, deleteBook);
bookRouter.get("/by-genre/:genre", getBookByGenre);
bookRouter.get("/details/:slug", getBooksPublicDetails);
bookRouter.get("/recommended/:bookId", getRecommendedBooks);
bookRouter.get("/read/:slug", isAuth, generateBookAccessUrl);


export default bookRouter;