import { Link } from '@remix-run/react';
import { Image } from '@unpic/react';
import { Button } from '~/components/ui/button';
import SectionTitle from '~/components/website/SectionTitle';
import TextRenderer from '~/components/website/TextRenderer';
import { IMAGE } from '~/constants/image.constant';
import { IImage } from '~/interfaces/image.interface';

export default function Ambassador({
  ambassadorImages,
}: {
  ambassadorImages: IImage[];
}) {
  return (
    <section id='kol' className='pt-8'>
      <div className='container grid-cols-1'>
        <SectionTitle>ĐẠI SỨ đồng hành cùng iconic pro</SectionTitle>

        <div className='flex flex-col gap-6'>
          {ambassadorImages.map((image, i) => (
            <div className='flex flex-col gap-4 items-center col-span-12'>
              <div className='bg-gradient-to-b from-transparent via-main/10 to-transparent'>
                <Image
                  className='mx-auto'
                  src={image.img_url}
                  alt={image.img_title}
                  layout='fullWidth'
                />
              </div>

              <TextRenderer content={image.img_description} />

              {image.img_link && (
                <Button variant='main' className='mt-4' asChild>
                  <Link to={image.img_link}>Đọc thêm</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
