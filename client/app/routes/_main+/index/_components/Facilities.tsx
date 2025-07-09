import { Image } from '@unpic/react';
import { Button } from '~/components/ui/button';
import SectionTitle from '~/components/website/SectionTitle';

export default function Facilities() {
  return (
    <section id='facilities' className=''>
      <div className='container grid-cols-1 px-8'>
        <SectionTitle>CƠ SỞ VẬT CHẤT HIỆN ĐẠI</SectionTitle>

        <div className='flex items-center xl:mt-20 max-lg:flex-wrap max-md:-mx-6 lg:-ml-8'>
          {[
            {
              title: 'Cơ sở vật chất hiện đại',
              description:
                'Iconic Pro được trang bị cơ sở vật chất hiện đại, đầy đủ tiện nghi và thiết bị học tập tiên tiến, tạo điều kiện tốt nhất cho học viên trong quá trình học tập và rèn luyện kỹ năng.',
              image: '/images/facilities/1.png',
            },
            {
              title: 'Phòng học chuyên nghiệp',
              description:
                'Phòng học tại Iconic Pro được thiết kế chuyên nghiệp, trang bị đầy đủ thiết bị giảng dạy hiện đại, giúp học viên có trải nghiệm học tập tốt nhất.',
              image: '/images/facilities/1.png',
            },
          ].map((item, i) => (
            <article
              key={i}
              className='flex max-sm:flex-row rounded-xl relative h-fit max-xl:mb-8 lg:ml-8'
              style={{
                boxShadow: '1px 2px 15px 2px rgba(var(--main-color), 0.15)',
              }}
            >
              <div className='flex flex-col w-1/2 xl:w-3/5 py-5 px-5 xl:px-8'>
                <h3 className='m-0 text-main font-bold text-sm uppercase'>
                  {item.title}
                </h3>

                <p className='mt-2 mb-4 color-sub3 flex-grow text-pretty'>
                  {item.description}
                </p>

                <Button className='bg-main rounded-full font-bold uppercase'>
                  Tìm hiểu thêm
                </Button>
              </div>

              <Image
                className='h-fit max-md:mt-8 xl:absolute w-1/2 xl:w-2/5 right-0 xl:-top-1/3'
                src={item.image}
                alt={item.title}
                layout='fullWidth'
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
