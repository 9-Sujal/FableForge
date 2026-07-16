import { Chip, Link } from "@heroui/react";
import { calculateDiscount, formatPrice } from "../utils/helper";
import DividerWithTitle from "./common/DividerWithTitle";
import { FaStar } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
export interface Book {
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

interface Props {
  data: Book[];
  title: string | "";
}

export default function BookList({ data, title }: Props) {
  return (
    <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl
                    bg-white/40 backdrop-blur-xl 
                    dark:bg-white/5 dark:border-white/5g">
      <DividerWithTitle title={title} />

      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[80px] pointer-events-none" />
    <div className="absolute -top-24 -left-24 w-48 h-48 
                bg-violet-400/30 blur-[80px] pointer-events-none 
                dark:bg-cyan-500/20" />

{/* Second accent glow for depth */}
<div className="absolute -bottom-16 -right-16 w-40 h-40 
                bg-sky-400/25 blur-[70px] pointer-events-none 
                dark:bg-indigo-500/20" />
        <div className="mt-6 p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {data.map((book) => {
          return (
            <Link key={book.id} as={RouterLink} to={`/book/${book.slug}`}>
              <div className="flex w-full justify-center mb-3">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-32 h-48 object-cover shadow-md rounded"
                />

                <div className="w-full space-y-2">
                  <p className="font-bold line-clamp-2">{book.title}</p>

                  <Chip color="danger" radius="sm" size="sm">
                    {calculateDiscount(book.price)}% Off
                  </Chip>
                </div>

                <div className="w-full">
                  <div className="flex space-x-2">
                    <p className="font-bold">
                      {formatPrice(Number(book.price.sale))}
                    </p>
                    <p className="line-through">
                      {formatPrice(Number(book.price.mrp))}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  {book.rating ? (
                    <Chip radius="sm" color="warning" variant="solid">
                      <div className="flex items-center font-semibold text-sm space-x-1">
                        <span>{book.rating}</span> <FaStar />
                      </div>
                    </Chip>
                  ) : (
                    <span>No Ratings</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};



