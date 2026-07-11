

import { useEffect, useState } from "react";
import client from "../api/client";
import { Button, Skeleton } from "@heroui/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface FeaturedBook {
  title: string;
  slogan: string;
  subtitle: string;
  cover: string;
  slug: string;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false, // ← hide arrows for cleaner look
};

export default function HeroSection() {
  const [books, setBooks] = useState<FeaturedBook[]>([]);
  const [busy, setBusy] = useState(true); // ← track loading

  useEffect(() => {
    client.get<{ featuredBooks: FeaturedBook[] }>("/book/featured")
      .then(({ data }) => {
        setBooks(data.featuredBooks);
      })
      .catch(console.error)
      .finally(() => setBusy(false));
  }, []);

  // ← skeleton while loading
  if (busy) return (
    <Skeleton className="w-full h-96 rounded-xl" />
  );

  if (!books.length) return null;

  return (
     <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl
                    bg-white/40 backdrop-blur-xl 
                    dark:bg-white/5 dark:border-white/5">
      
      {/* Decorative inner glow to match the 'futuristic' vibe */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[80px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-48 h-48 
                bg-violet-400/30 blur-[80px] pointer-events-none 
                dark:bg-cyan-500/20" />

{/* Second accent glow for depth */}
<div className="absolute -bottom-16 -right-16 w-40 h-40 
                bg-sky-400/25 blur-[70px] pointer-events-none 
                dark:bg-indigo-500/20" />

      <Slider {...settings}>
        {books.map((item) => (
          <div key={item.slug}>
            <div className="min-h-100 flex flex-col md:flex-row items-center justify-between px-10 py-8 gap-8">
              
              {/* Text Content */}
              <div className="flex-1 space-y-6 z-10">
                <h1 className="lg:text-6xl text-3xl font-extrabold tracking-tight leading-tight 
                               text-slate-900 dark:text-transparent dark:bg-clip-text 
                               dark:bg-linear-to-br dark:from-white dark:to-slate-400">
                  {item.slogan}
                </h1>
                
                <p className="text-lg font-medium text-slate-600 dark:text-cyan-100/60 max-w-md italic">
                  {item.subtitle}
                </p>

                <div>
                  <Button
                    radius="sm"
                    color="danger"
                    endContent={<FaArrowRightLong />}
                    as={Link}
                    to={`/book/${item.slug}`}
                  >
                    Read Now
                  </Button>
                </div>
              </div>

              {/* Cover with Futuristic Glow */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Book Shadow Glow */}
                <div className="absolute w-40 h-64 bg-cyan-500/30 blur-[60px] dark:block hidden" />
                
                <img
                  src={item.cover}
                  alt={item.title}
                  className="relative z-10 md:w-56 md:h-80 w-36 h-52 rounded-lg object-cover 
                             shadow-[20px_20px_50px_rgba(0,0,0,0.3)] 
                             rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500"
                />
              </div>

            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}