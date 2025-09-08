import { useState } from 'react';

import style from './index.module.css';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useIsMobile } from '~/hooks/use-mobile';
import { SheetDescription } from '~/components/ui/sheet';
import TextRenderer from '../TextRenderer';
import { IImage } from '~/interfaces/image.interface';

export default function MasterDetail({ data }: { data: Array<IImage> }) {
  const [tab, setTab] = useState(data[0]?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isMobile = useIsMobile();

  return (
    <div className='grid grid-cols-12 gap-x-8'>
      <nav className='col-span-12'>
        <ul className={`${style.menu}`}>
          {data.map((master, i) => (
            <li className='' key={i}>
              <a
                href={`#${master.id}`}
                className={`${master.id === tab ? style.active : ''} max-lg:my-0`}
                aria-label={master.id}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(master.id);
                  setIsDialogOpen(true);
                }}
              >
                <img
                  src={master.img_url}
                  alt={master.img_title}
                  className='w-full h-full object-contain'
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile view - Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='w-11/12 max-h-[90vh] overflow-hidden rounded-2xl border-none p-0'>
          <DialogHeader className='hidden'>
            <DialogTitle className='sr-only'>Details for {tab}</DialogTitle>
            <SheetDescription className='sr-only'>
              description goes here
            </SheetDescription>
          </DialogHeader>
          <Details data={data.find((d) => d.id === tab)!} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Details = ({ data }: { data: IImage }) => {
  return (
    <article
      className='p-8 text-main'
      style={{
        backgroundColor:
          'rgb(from rgb(var(--main-color)) r g b / 0.05) !important',
      }}
    >
      {/* <TextRenderer content={details.content} /> */}
      <h3 className='text-2xl font-bold mb-4'>{data?.img_title}</h3>
      <TextRenderer content={data?.img_description} />

      <div className='flex justify-center mt-6'>
        <Button
          className='uppercase px-10 font-bold rounded-full bg-main text-white'
          onClick={() => {
            if (
              typeof window !== 'undefined' &&
              (window as any).openRegistrationPopup
            ) {
              (window as any).openRegistrationPopup();
            }
          }}
        >
          Đăng ký ngay
        </Button>
      </div>
    </article>
  );
};
