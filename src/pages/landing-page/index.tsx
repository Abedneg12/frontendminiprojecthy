'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const images: string[] = [
    '/placeholder1.jpg',
    '/placeholder2.jpg',
    '/placeholder3.jpg'
  ];

  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number): void => {
    setCurrent(index);
  };

  const nextSlide = (): void => {
    setCurrent(prev => (prev + 1) % images.length);
  };

  const prevSlide = (): void => {
    setCurrent(prev => (prev - 1 + images.length) % images.length);
  };

  const exploreClick = () => {
    const trendingSection = document.getElementById('trending-now');
    if (trendingSection) {
      trendingSection.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="w-full font-montserrat">
      <section className="relative w-full h-[500px] md:h-[500px] lg:h-[500px]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex h-full transition-transform duration-500 ease-in-out" 
               style={{ transform: `translateX(-${current * 100}%)` }}>
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <Image 
                  src={image} 
                  alt={`Slide ${index + 1}`} 
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="text-center text-white w-full max-w-3xl px-4 sm:px-6 pt-20 py-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 sm:mb-4 md:mb-5">
        Create. Connect. Celebrate.
        </h1>
        <p className="text-base sm:text-lg mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
        FindYourTicket is your gateway to amazing events. Discover or host your own!
        </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link 
                href="/#trending-now"
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    const element = document.getElementById('trending-now');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded text-sm sm:text-base"
              >
                Explore Events
              </Link>
              <Link
                href="/create-event"
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded text-sm sm:text-base text-center"
              >
                Create Your Event
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="hidden sm:block absolute left-0 top-0 h-full w-1/4 cursor-default z-20"
          aria-label="Previous Slide"
        />

        <button
          onClick={nextSlide}
          className="hidden sm:block absolute right-0 top-0 h-full w-1/4 cursor-default z-20"
          aria-label="Next Slide"
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${current === index ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="py-6 sm:py-8 md:py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {['Music', 'Sports', 'Arts', 'Food', 'Business', 'Education', 'Comedy', 'Family', 'Festivals', 'Technology', 'Health', 'Other'].map((category, i) => (
              <span 
                key={i}
                className="text-xs sm:text-sm px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded-full transition-colors cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}