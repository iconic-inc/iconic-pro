import { ChevronUp } from 'lucide-react';
import { useEffect } from 'react';

export default function BackToTop({ className }: { className?: string }) {
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        document.querySelector('#scroll-to-top')?.classList.remove('hidden');
      } else {
        document.querySelector('#scroll-to-top')?.classList.add('hidden');
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      id='scroll-to-top'
      onClick={scrollToTop}
      className={`hidden ${className} rounded-full p-5 bg-sub1
        hover:text-white hover:border-transparent transition-all duration-300 z-50`}
      style={{ position: 'fixed', bottom: 80, right: 20 }}
    >
      <div>
        <ChevronUp className='text-white' />
      </div>
    </button>
  );
}
