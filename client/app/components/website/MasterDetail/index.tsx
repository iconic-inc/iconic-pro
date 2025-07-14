import { useState } from 'react';
import { Image } from '@unpic/react';

import style from './index.module.css';
import { X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { useIsMobile } from '~/hooks/use-mobile';
import { SheetDescription } from '~/components/ui/sheet';

export default function MasterDetail({
  data,
}: {
  data: Array<{
    banner: string;
    isHot: boolean;
    tab: string;
    details: {
      content: {
        title: string;
        description: string[];
      }[];
      alt: string;
    };
  }>;
}) {
  const [tab, setTab] = useState(data[0].tab);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const details = data.find((d) => d.tab === tab)?.details;
  const isMobile = useIsMobile();

  return (
    <div className='grid grid-cols-12 gap-x-8'>
      <nav className='col-span-12'>
        <ul className={`${style.menu}`}>
          {data.map((master, i) => (
            <li className='' key={i}>
              <a
                href={`#${master.tab}`}
                className={`${master.tab === tab ? style.active : ''} ${
                  master.isHot ? style.hot : ''
                } max-lg:my-0`}
                aria-label={master.tab}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(master.tab);
                  setIsDialogOpen(isMobile);
                }}
              >
                <img
                  src={master.banner}
                  alt={master.details.alt}
                  className='w-full h-full object-contain'
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop view - always visible */}
      <div className='hidden col-span-7 overflow-hidden'>
        {details ? (
          <Details details={details} />
        ) : (
          <p>Click on a tab to view details</p>
        )}
      </div>

      {/* Mobile view - Dialog */}
      <Dialog open={isDialogOpen && isMobile} onOpenChange={setIsDialogOpen}>
        <DialogContent className='w-11/12 max-h-[90vh] overflow-hidden rounded-2xl border-none p-0'>
          <DialogHeader className='hidden'>
            <DialogTitle className='sr-only'>Details for {tab}</DialogTitle>
            <SheetDescription className='sr-only'>
              description goes here
            </SheetDescription>
          </DialogHeader>
          {details && <Details details={details} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Details = ({
  details,
}: {
  details: {
    content: {
      title: string;
      description: string[];
    }[];
    alt: string;
  };
}) => {
  return (
    <article
      className='p-8 text-main'
      style={{
        backgroundColor:
          'rgb(from rgb(var(--main-color)) r g b / 0.05) !important',
      }}
    >
      <div className='flex flex-col lg:flex-row gap-4'>
        <section className='flex-grow'>
          {details.content.map((content, i) => (
            <div key={i} className='mb-4'>
              <h3 className='text-xl font-semibold mb-3'>{content.title}</h3>

              <ul
                className='space-y-2 list-disc'
                style={{ listStyle: 'disc !important' }}
              >
                {Array.isArray(content.description) ? (
                  content.description.map((desc, i) => (
                    <li key={i} className='text-sm'>
                      {desc}
                    </li>
                  ))
                ) : (
                  <li className='text-sm'>{content.description}</li>
                )}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <div className='flex justify-center mt-6'>
        <Button className='uppercase px-10 font-bold rounded-full bg-main text-white'>
          Đăng ký ngay
        </Button>
      </div>
    </article>
  );
};
