'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

interface CarImageGalleryProps {
  images: string[];
  alt: string;
}

const CarImageGallery = ({ images, alt }: CarImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [showThumbnails, setShowThumbnails] = useState(true);
  
  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-md border border-black/10 mb-6">
        <div className="relative h-96 w-full bg-gray-100 rounded flex items-center justify-center">
          <span className="text-gray-400">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-black/10 mb-6">
      {/* Main Gallery Section */}
      <div className="relative">
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 text-4xl font-bold text-gray-400 pointer-events-none z-10 rotate-[-20deg]">
          AutoElite
        </div>
        
        {/* Main Image Swiper */}
        <Swiper
          spaceBetween={0}
          navigation={true}
          pagination={{
            type: 'fraction',
            el: '.swiper-pagination',
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
          className="rounded-t-md overflow-hidden"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[450px] w-full bg-white">
                <Image
                  src={img}
                  alt={`${alt} - Image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
          
          <div className="swiper-pagination absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm z-10 w-auto left-auto"></div>
        </Swiper>
      </div>
      
      {/* Thumbnails Controls */}
      <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
        <button 
          onClick={() => setShowThumbnails(!showThumbnails)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showThumbnails ? 'Hide thumbnails' : 'Show thumbnails'}
        </button>
        
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All
        </button>
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="px-3 py-2 border-t border-gray-200">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs-swiper"
            breakpoints={{
              320: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 7 },
            }}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index} className="cursor-pointer">
                <div className="relative h-16 w-full border border-gray-200 hover:border-blue-400 rounded overflow-hidden">
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default CarImageGallery; 