import { useEffect, useState } from "react";
import type { Book } from "./BookList";
import { parseError } from "../utils/helper";
import client from "../api/client";
import Skeletons from "./Skeletons";
import BookList from "./BookList";

interface Props {
  genre: string;
}


export default function BookByGenre({ genre }: Props) {
   const [books, setBooks] = useState<Book[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const fetchBooks = async (genre: string) => {
      try {
        const { data } = await client.get("/book/by-genre/" + genre);
        setBooks(data.books);
      } catch (error) {
        parseError(error);
      } finally {
        setBusy(false);
      }
    };

    fetchBooks(genre);
  }, [genre]);

  if (busy) return <Skeletons.BookList />;

  return <BookList title={genre} data={books} />;
};
