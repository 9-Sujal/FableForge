import { useEffect, useState } from "react";
import client from "../api/client";
import toast from "react-hot-toast";
import { parseError } from "../utils/helper";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

interface AuthorProps {
  visible?: boolean;
  authorId?: string;
}

interface PublishedBook {
  id: string;
  title: string;
  slug: string;
  status: string;
}

export default function AuthorPublicationTable({authorId, visible}:AuthorProps) {
   const [books, setBooks] = useState<PublishedBook[]>([]);
  const [removeRequestId, setRemoveRequestId] = useState("");
  const [removingBookId, setRemovingBookId] = useState("");

  const handleOnRemoveConfirm = async () => {
    try {
      setRemovingBookId(removeRequestId);
      const { data } = await client.delete("/book/" + removeRequestId);
      if (data.success) {
        toast.success("The book removed successfully!");
        setBooks((oldBooks) =>
          oldBooks.filter((book) => book.id !== removeRequestId)
        );
      } else {
        toast.error(
          (t) => (
            <div className="space-y-2">
              <span>
                We could not remove the book, the reasons can be multiple!
              </span>
              <li>The books is already purchased by someone.</li>
              <li>Or your content does not support the feature.</li>
              <button className="p-2" onClick={() => toast.dismiss(t.id)}>
                Dismiss
              </button>
            </div>
          ),
          { duration: 7000 }
        );
      }
    } catch (error) {
      parseError(error);
    } finally {
      setRemovingBookId("");
    }
  };

  useEffect(() => {
    if (authorId) {
      client.get("/author/books/" + authorId).then(({ data }) => {
        setBooks(data.books);
      });
    }
  }, [authorId]);

  if (!visible) return null;

  return (
    <Table aria-label="Author book collection table" shadow="none">
      <TableHeader>
        <TableColumn className="w-3/5">Title</TableColumn>
        <TableColumn className="w-2/12">Status</TableColumn>
        <TableColumn className="w-2/12">Action</TableColumn>
      </TableHeader>
      <TableBody>
        {books.map((book) => {
          return (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.status}</TableCell>
              <TableCell>
                <div className="flex space-x-3 relative">
                  {removeRequestId === book.id && (
                    <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
                      <button
                        onMouseDown={handleOnRemoveConfirm}
                        className="underline"
                      >
                        Please confirm to remove!
                      </button>
                    </div>
                  )}
                  <Button
                    onClick={() => setRemoveRequestId(book.id)}
                    onBlur={() => setRemoveRequestId("")}
                    isIconOnly
                    size="sm"
                    isLoading={removingBookId === book.id}
                  >
                    <FaRegTrashCan />
                  </Button>
                  <Button
                    to={"/update-book/" + book.slug}
                    as={Link}
                    isIconOnly
                    size="sm"
                    isLoading={removingBookId === book.id}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    as={Link}
                    to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                    isIconOnly
                    size="sm"
                  >
                    <IoEyeOutline />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
