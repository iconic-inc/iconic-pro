import { Image } from '@unpic/react';
import { Button } from '~/components/ui/button';
import SectionTitle from '~/components/website/SectionTitle';
import TextRenderer from '~/components/website/TextRenderer';
import { IImage } from '~/interfaces/image.interface';

export default function Facilities({
  facilitiesImages,
}: {
  facilitiesImages: IImage[];
}) {
  return (
    <section id='facilities' className=''>
      <div className='container grid-cols-1 px-8'>
        <SectionTitle>CƠ SỞ VẬT CHẤT HIỆN ĐẠI</SectionTitle>

        <div className='flex items-center flex-wrap -mx-6'>
          {facilitiesImages.map((item, i) => (
            <article
              key={i}
              className='flex flex-row items-center rounded-xl relative h-fit mb-8'
              style={{
                boxShadow: '1px 2px 15px 2px rgba(var(--main-color), 0.15)',
              }}
            >
              <div className='flex flex-col w-1/2 py-5 px-5'>
                <h3 className='m-0 text-main font-bold text-sm uppercase'>
                  {item.img_title}
                </h3>

                <TextRenderer content={item.img_description} />

                {/* <Button className='bg-main rounded-full font-bold uppercase'>
                  Tìm hiểu thêm
                </Button> */}
              </div>

              <Image
                className='h-fit w-1/2 right-0'
                src={item.img_url}
                alt={item.img_title}
                layout='fullWidth'
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
