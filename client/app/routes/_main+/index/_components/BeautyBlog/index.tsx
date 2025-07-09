import SectionTitle from '~/components/website/SectionTitle';
import Blogs from './Blogs';
import { Button } from '~/components/ui/button';

export default function BeautyBlog() {
  return (
    <section id='blog'>
      <div className='container grid-cols-1 mt-6'>
        <SectionTitle>KIẾN THỨC ngành</SectionTitle>

        <Blogs blogs={blogs} />

        <Button variant={'main'} className='w-fit'>
          Xem thêm
        </Button>
      </div>
    </section>
  );
}

const blogs = [
  {
    image: '/images/blogs/megalive.png',
    title: 'Cách quản lý nhân sự trong ngành làm đẹp',
    preview:
      'Quản lý nhân sự là một trong những yếu tố quan trọng nhất trong ngành làm đẹp. Bài viết này sẽ cung cấp cho bạn những chiến lược hiệu quả để quản lý nhân sự trong ngành làm đẹp.',
    link: '/',
    date: '2021-09-01',
    isMain: true,
  },
  {
    image: '/images/blogs/megalive.png',
    title: 'Làm đẹp và sức khỏe - Mối liên hệ không thể tách rời',
    preview:
      'Làm đẹp không chỉ là về ngoại hình, mà còn liên quan đến sức khỏe. Bài viết này sẽ khám phá mối liên hệ giữa làm đẹp và sức khỏe, và cách bạn có thể chăm sóc bản thân một cách toàn diện.',
    link: '/',
    date: '2021-09-02',
    isMain: false,
  },
  {
    image: '/images/blogs/megalive.png',
    title: 'Xu hướng làm đẹp 2023 - Những điều bạn cần biết',
    preview:
      'Năm 2023 hứa hẹn sẽ mang đến nhiều xu hướng làm đẹp mới. Bài viết này sẽ điểm qua những xu hướng nổi bật trong ngành làm đẹp và cách bạn có thể áp dụng chúng vào cuộc sống hàng ngày.',
    link: '/',
    date: '2021-09-03',
    isMain: false,
  },
];
