"use client";
import { IconArrowLeft, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";

export interface SlideData {
  title: string;
  category?: string;
  description?: string;
  src: string;
  badge?: string;
}

interface CarouselProps {
  slides: SlideData[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export function Carousel({ slides, autoplay = true, autoplayInterval = 5000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const id = useId();

  useEffect(() => {
    if (!autoplay || isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, isHovered, slides.length]);

  const handlePrevious = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrevious();
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[current];

  return (
    <div
      className="w-full max-w-5xl mx-auto px-4"
      aria-labelledby={`carousel-heading-${id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Slide Card Container */}
      <div
        className="relative rounded-3xl overflow-hidden glass-card border border-slate-200/80 dark:border-white/10 shadow-2xl transition-all duration-500 group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Aspect Ratio Box */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-slate-900">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Image */}
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700"
                unoptimized
              />
              {/* Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />

              {/* Text Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end max-w-3xl space-y-3 z-20">
                {slide.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md w-fit">
                    <IconSparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                  {slide.title}
                </h3>
                {slide.description && (
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
                    {slide.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-950/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 shadow-lg hover:scale-110 transition-all duration-300"
        >
          <IconArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-950/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 shadow-lg hover:scale-110 transition-all duration-300"
        >
          <IconArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Pagination Controls & Indicators */}
      <div className="flex items-center justify-between mt-6 px-2">
        <div className="text-xs font-mono text-theme-secondary">
          <span className="font-bold text-theme">0{current + 1}</span> / 0{slides.length}
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                  : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-blue-400"
              }`}
            />
          ))}
        </div>

        <div className="text-xs text-theme-secondary font-medium hidden sm:block">
          Swipe or click arrows to explore
        </div>
      </div>
    </div>
  );
}
