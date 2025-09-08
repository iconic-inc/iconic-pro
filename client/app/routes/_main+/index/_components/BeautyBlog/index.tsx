import SectionTitle from '~/components/website/SectionTitle';
import Blogs from './Blogs';
import { Button } from '~/components/ui/button';
import Defer from '~/components/Defer';
import { IPage } from '~/interfaces/page.interface';
import { Link } from '@remix-run/react';

export default function BeautyBlog({
  blogs,
}: {
  blogs: IPage[] | Promise<IPage[]>;
}) {
  return (
    <section id='blog'>
      <div className='container grid-cols-1 mt-6'>
        <SectionTitle>KIẾN THỨC ngành</SectionTitle>

        <Defer resolve={blogs}>{(posts) => <Blogs blogs={posts} />}</Defer>

        <Button variant={'main'} className='w-fit'>
          <Link to='/blog'>Xem thêm</Link>
        </Button>
      </div>
    </section>
  );
}
