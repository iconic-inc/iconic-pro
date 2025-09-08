import { Link } from '@remix-run/react';
import { Image } from '@unpic/react';
import Defer from '~/components/Defer';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import SectionTitle from '~/components/website/SectionTitle';
import { IImage } from '~/interfaces/image.interface';

export default function PressMedia({
  partnerImages,
  newspaperImages,
}: {
  partnerImages: IImage[];
  newspaperImages: IImage[];
}) {
  return (
    <aside>
      <section id='testimony' className='py-4'>
        <div className='container grid-cols-1'>
          <SectionTitle>BÁO CHÍ NÓI VỀ Iconic PRO</SectionTitle>

          <div className='flex flex-col'>
            <div className='col-span-5 flex items-center mb-4 text-justify'>
              <p className='text-black text-lg'>
                Iconic PRO là học viện kỹ năng chuyên nghiệp hàng đầu trong
                ngành làm đẹp tại Việt Nam. Chúng tôi tự hào được báo chí và
                truyền thông công nhận là một trong những đơn vị đào tạo uy tín
                và chất lượng. Dưới đây là một số bài viết và phỏng vấn từ các
                tờ báo lớn về Iconic PRO.
              </p>
            </div>

            <ScrollArea>
              <div className='grid-cols-12 gap-y-8 flex flex-nowrap'>
                {newspaperImages.map((t, i) => (
                  <a
                    href={t.img_link || '#'}
                    target='_blank'
                    className='col-span-3'
                    key={i}
                  >
                    <div className='aspect-[17/7] h-[70px] my-4 mx-3'>
                      <Image
                        src={t.img_url || '/images/logo.png'}
                        alt={t.img_title || 'Báo chí nói về Iconic PRO'}
                        layout='fullWidth'
                        key={i}
                        className='object-contain'
                      ></Image>
                    </div>
                  </a>
                ))}
              </div>

              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
        </div>
      </section>

      <section id='partner' className='py-8'>
        <div className='container grid-cols-1'>
          <SectionTitle>ĐỐI TÁC CỦA LINH ANH</SectionTitle>

          <div className='grid grid-cols-12 gap-8 grid-rows-2 px-4 gap-10'>
            {partnerImages.map((p, i) => (
              <a
                href={p.img_link || '#'}
                target='_blank'
                rel='noopener noreferrer'
                className='col-span-6'
                key={i}
              >
                <Image
                  className='col-span-6 object-contain'
                  src={p.img_url || '/images/logo.png'}
                  layout='fullWidth'
                  key={i}
                  title={p.img_title || 'Đối tác Iconic PRO'}
                  alt={p.img_title || 'Đối tác Iconic PRO'}
                ></Image>
              </a>
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}
