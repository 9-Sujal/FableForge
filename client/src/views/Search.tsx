import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import client from "../api/client";
import type { Book } from "../components/BookDetail";
import LoadingSpinner from "../components/common/LoadingSpinner";
import DividerWithTitle from "../components/common/DividerWithTitle";
import BookList from "../components/BookList";


export default function Search() {
  const [result, setResult] = useState<Book[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [searchParam] = useSearchParams();

  const title = searchParam.get("title");

useEffect(() => {
    if (!title) return;

    const fetchResults = async () => {
      setBusy(true);  // ← inside async function, not directly in effect body
      try {
        const { data } = await client.get<{ results: Book[] }>(
          "/search/books?title=" + title
        );
        setNotFound(data.results.length === 0);
        setResult(data.results);
      } finally {
        setBusy(false);
      }
    };

    fetchResults();
  }, [title]);


  const heading = `Search Result For: ${title}`;

  if (busy) return <LoadingSpinner label="Searching..." />;

  if (notFound)
    return (
      <div className="px-4 py-10">
        <DividerWithTitle title={heading} />
        <p className="text-center p-5 text-2xl font-semibold opacity-50">
          No Results Found...
        </p>
      </div>
    );

  return (
    <div className="px-4 py-10">
      <BookList data={result} title={heading} />
    </div>
  );
};

