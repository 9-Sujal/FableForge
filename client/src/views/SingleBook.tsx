import { useEffect, useState } from "react";
import type { Book } from "../components/BookDetail";
import { parseError } from "../utils/helper";
import client from "../api/client";
import { useParams } from "react-router-dom";
import Skeletons from "../components/Skeletons";
import BookDetail from "../components/BookDetail";
import type { Review } from "../components/ReviewSection";
import ReviewSection from "../components/ReviewSection";

const fetchBookReviews = async (id: string) => {
  const { data } = await client.get("/review/list/" + id);
  return data.reviews;
};

export default function SingleBook() {
  const [bookDetails, setBookDetails] = useState<Book>();
  const [busy, setBusy] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const { data } = await client.get("/book/details/" + slug);
        setBookDetails(data.book);
        const reviews = await fetchBookReviews(data.book.id);
        setReviews(reviews);
      } catch (error) {
        parseError(error);
      } finally {
        setBusy(false);
      }
    };

    fetchBookDetail();
  }, [slug]);

  if (busy)
    return (
      <div className="p-5 lg:p-0">
        <Skeletons.BookDetails />
      </div>
    );

  return (
    <div className="p-5 lg:p-0 space-y-20">
      <BookDetail book={bookDetails} />

      {/* <RecommendedSection id={bookDetails?.id} /> */}

      {/* Review Section */}
      <ReviewSection
        id={bookDetails?.id}
        reviews={reviews}
        title={`${bookDetails?.title} Reviews`}
      />
    </div>
  );
};

