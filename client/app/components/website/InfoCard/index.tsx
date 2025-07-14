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
}: {
  image: string;
  button?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
  isHighlight?: boolean;
}) {
  return (
    <article
      className={`${style.card} ${
        isHighlight ? style.highlight : ''
      } ${className}`}
    >
      <Image
        className={`${style.content_image}`}
        src={image}
        loading='lazy'
        layout='fullWidth'
        // cdn='netlify'
      />
      <div className='flex-grow'>
        {title && <h3 className={style.title}>{title}</h3>}

        {children && <div className={`${style.content}`}>{children}</div>}
      </div>

      {button && (
        <Button className='mt-5 uppercase font-bold rounded-full bg-main'>
          {button}
        </Button>
      )}
    </article>
  );
}
