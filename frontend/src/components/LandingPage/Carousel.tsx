"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  images: string[]; // Array of image URLs
}

export default function Carousel({ images }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <div className="relative w-full  flex py-4">
      {images.map((img, index) => (
        <div key={index} className="w-full flex justify-center items-center">
          <img
            src={img}
            alt={`Slide ${index}`}
            className="w-full h-64 md:h-96 object-contain"
          />
        </div>
      ))}
    </div>
  );
}
