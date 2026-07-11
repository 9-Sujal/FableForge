import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import axios from "axios";
import toast from "react-hot-toast";
import { parseError } from "../utils/helper";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BookForm, { type InitialBookToUpdate } from "../components/BookForm";



export default function UpdateBookForm() {
   const [bookInfo, setBookInfo] = useState<InitialBookToUpdate>();
  const [busy, setBusy] = useState(true);
  const { slug } = useParams();

  const handleSubmit = async (data: FormData, file?: File | null) => {
    const res = await client.patch("/book", data);
    if (res.data && file) {
      axios.put(res.data, file, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
    }
    toast("The book updated successfully.", {
      duration: 5000,
    });
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await client.get(`/book/details/${slug}`);
        setBookInfo(data.book);
      } catch (error) {
        parseError(error);
      } finally {
        setBusy(false);
      }
    };

    fetchBookDetails();
  }, [slug]);

  if (busy) return <LoadingSpinner />;

  return (
    <BookForm
      onSubmit={handleSubmit}
      initialState={bookInfo}
      title="Update Book"
      submitBtnTitle="Update Book"
    />
  );
};
