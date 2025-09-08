import { Image } from '@unpic/react';

import style from './index.module.css';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

export default function InfoCard({
  image,
  button,
  title,
  className,
  children,
  isHighlight,
  imgRatio,
}: {
  image: string;
  button?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
  isHighlight?: boolean;
  imgRatio?: string;
}) {
  return (
    <article
      className={`${style.card} ${
        isHighlight ? style.highlight : ''
      } ${className}`}
    >
      <div
        className={`bg-red-500/10 rounded-lg overflow-hidden ${imgRatio || ''}`}
      >
        <Image
          className={`${style.content_image} object-cover`}
          src={image}
          loading='lazy'
          layout='fullWidth'
          // cdn='netlify'
        />
      </div>
      <div className='flex-grow'>
        {title && <h3 className={style.title}>{title}</h3>}

        {children}
      </div>

      {button && (
        <Button
          className='mt-5 uppercase font-bold rounded-full bg-main'
          onClick={() => {
            if (
              typeof window !== 'undefined' &&
              (window as any).openRegistrationPopup
            ) {
              (window as any).openRegistrationPopup();
            }
          }}
        >
          {button}
        </Button>
      )}
    </article>
  );
}
