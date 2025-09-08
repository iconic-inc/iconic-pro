import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel';
import { useEffect, useState } from 'react';
import { IImage } from '~/interfaces/image.interface';

export default function MainSlider({
  bannerImages,
}: {
  bannerImages: IImage[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className='w-full relative'>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className='w-full'
        setApi={setApi}
      >
        <CarouselContent>
          {bannerImages.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className='relative w-full h-[538px] overflow-hidden'>
                {/* Background Image */}
                <div
                  className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                  style={{
                    backgroundImage: `url(${slide.img_url})`,
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - visible on all devices */}
        <CarouselPrevious className='left-2 md:left-4 bg-sub1/20 border-sub1/30 hover:bg-sub1/30 text-sub1 backdrop-blur-sm' />
        <CarouselNext className='right-2 md:right-4 bg-sub1/20 border-sub1/30 hover:bg-sub1/30 text-sub1 backdrop-blur-sm' />
      </Carousel>

      {/* Dots indicator */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20'>
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index + 1 === current
                ? 'bg-sub1 scale-125'
                : 'bg-sub1/50 hover:bg-sub1/75'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
