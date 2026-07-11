import { useNavigate } from "react-router-dom";
import client from "../api/client";
import axios from "axios";
import toast from "react-hot-toast";
import BookForm from "../components/BookForm";


export default function NewBookForm() {
 const navigate = useNavigate();
  const handleSubmit = async (data: FormData, file?: File | null) => {
    const res = await client.post<{ fileUploadUrl: string; slug: string }>(
      "/book/create",
      data
    );
    if (res.data && file) {
      await axios.put(res.data.fileUploadUrl, file, {
        headers: {
          "Content-Type":  "application/epub+zip",
        },
      });

      toast(
        "Congratulations, Your book has been published. It may take some time to reflect the changes.",
        {
          duration: 5000,
        }
      );
    }
    navigate("/update-book/" + res.data.slug);
  };

  return (
    <BookForm
      onSubmit={handleSubmit}
      title="Publish New Book"
      submitBtnTitle="Publish New Book"
    />
  );
};
