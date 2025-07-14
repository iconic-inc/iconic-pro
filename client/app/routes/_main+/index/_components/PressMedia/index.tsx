import { Image } from '@unpic/react';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import SectionTitle from '~/components/website/SectionTitle';

export default function PressMedia() {
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
                {/* <div className='col-span-7 grid grid-cols-12'> */}
                {testimonies.map((t: any, i: number) => (
                  <div key={i} className='aspect-[17/7] h-[70px] my-4 mx-3'>
                    <Image
                      src={t.image}
                      layout='fullWidth'
                      key={i}
                      className='object-contain'
                    ></Image>
                  </div>
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
            {partners.map((p: any, i: number) => (
              <Image
                className='col-span-6 object-contain'
                src={p.logo}
                layout='fullWidth'
                key={i}
                title={p.name}
                alt={`Đối tác ${p.name}`}
              ></Image>
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}

const testimonies = [
  {
    name: 'Giáo dục Thời nay',
    image: '/images/magazine/giao-duc-thoi-nay.png',
    link: 'https://giaoducthoinay.net/',
  },
  {
    name: 'Doanh nhân & Thương hiệu',
    image: '/images/magazine/doanh-nhan-thuong-hieu.png',
    link: 'https://doanhnhanthuonghieu.net/',
  },
  {
    name: 'Tỏa sáng Ngành',
    image: '/images/magazine/toa-sang-nganh.png',
    link: 'https://toasangnganh.net/',
  },
  {
    name: 'Sắc đẹp & Thương hiệu',
    image: '/images/magazine/sac-dep-va-thuong-hieu.png',
    link: 'https://sacdepthuonghieu.vn/',
  },
  {
    name: 'Chuyên gia trong ngành',
    image: '/images/magazine/chuyen-gia-trong-nganh.png',
    link: 'https://chuyengiatrongnganh.vn/',
  },
];

const partners = [
  {
    name: 'VTV',
    logo: '/images/doi-tac/vtv.png',
    link: 'https://vtv.vn/',
  },
  {
    name: 'PR Pro',
    logo: '/images/doi-tac/prpro.png',
    link: 'https://prpro.vn/',
  },
  {
    name: 'Iconic Talents',
    logo: '/images/doi-tac/iconictalents.png',
    link: 'https://iconictalents.vn/',
  },
  {
    name: 'Ree Lin Candle',
    logo: '/images/doi-tac/reelin.png',
    link: 'https://reelincandles.com/',
  },
];
