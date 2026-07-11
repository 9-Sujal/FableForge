
import { useEffect, useState } from "react";
import BookList, { type Book } from "./BookList";
import client from "../api/client";
import Skeletons from "./Skeletons";
import { parseError } from "../utils/helper";


interface Props {
  id?: string;
}



export default function RecommendedSection({id}:Props) {
 const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchBooks = async () => {
      try {
        const { data } = await client.get("/book/recommended/" + id);
        setBooks(data);
      } catch (error) {
        parseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchBooks();
  }, [id]);

  if (!id) return null;

  if (fetching) return <Skeletons.BookList />;

  return (
    <div>
      <BookList data={books} title="Books related to this book" />
    </div>
  );
};