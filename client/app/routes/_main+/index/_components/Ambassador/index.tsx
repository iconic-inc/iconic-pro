import { Image } from '@unpic/react';
import { Button } from '~/components/ui/button';
import SectionTitle from '~/components/website/SectionTitle';

export default function Ambassador() {
  return (
    <section id='kol' className='pt-8'>
      <div className='container grid-cols-1'>
        <SectionTitle>ĐẠI SỨ đồng hành cùng iconic pro</SectionTitle>

        <div className='grid grid-cols-12 gap-6 relative'>
          <div
            className='hidden md:block bg absolute inset-0 z-[-1]'
            style={{
              background:
                'url("/images/overlay.png") center center / cover no-repeat',
            }}
          ></div>

          <div className='grid grid-cols-1 gap-4 items-center col-span-12 md:col-span-6 lg:pr-16'>
            <Image
              className='w-2/3 mx-auto'
              src='/images/ambassadors/1.png'
              alt=''
              layout='fullWidth'
            />

            <p className='color-main text-lg text-justify flex-grow'>
              Iconic Pro tự hào là đơn vị đào tạo chuyên nghiệp trong ngành làm
              đẹp, với sứ mệnh mang đến những khóa học chất lượng cao và cập
              nhật xu hướng mới nhất. Chúng tôi hợp tác với các đại sứ nổi tiếng
              trong ngành để mang đến cho học viên những trải nghiệm học tập tốt
              nhất.
            </p>

            <Button variant='main' className='mt-4'>
              Đọc thêm
            </Button>
          </div>

          <div className='col-span-12 md:col-span-6 max-md:flex max-md:flex-col'>
            <Image src='/images/ambassadors/2.png' layout='fullWidth'></Image>

            <iframe
              className='w-full rounded-xl aspect-video m-auto mt-4 max-md:mb-4'
              src='https://www.youtube.com/embed/oZXd28w41d8?si=EoFiWFJND_fgTSLD'
              title='YouTube video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
