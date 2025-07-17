import { Link } from '@remix-run/react';
import { Image } from '@unpic/react';
import { IPage } from '~/interfaces/page.interface';

export default function Blogs({ blogs }: { blogs: Array<IPage> }) {
  const mainBlog = blogs[0];
  return (
    <div className='grid grid-cols-12 gap-5 px-4'>
      <article className='beauty-blog col-span-12 row-span-3 flex flex-col'>
        <Link to={`/blog/${mainBlog.pst_slug}`}>
          <div className='aspect-video'>
            <Image
              className='rounded-xl'
              src={
                mainBlog.pst_thumbnail?.img_url ||
                '/public/assets/image-placeholder.webp'
              }
              layout='fullWidth'
              alt={mainBlog.pst_title}
            />
          </div>

          <h3 className={'text-center truncate-2-lines'}>
            {mainBlog.pst_title}
          </h3>

          <div className='divider'></div>

          <p className={'text-justify truncate-3-lines'}>
            {mainBlog.pst_excerpt}
          </p>
        </Link>
      </article>

      {blogs.slice(1, 3).map((b, i) => (
        <article key={i} className='beauty-blog col-span-12 mt-4'>
          <Link className='h-fit flex flex-col' to='/'>
            <Image
              className='rounded-xl col-span-1'
              src={
                b.pst_thumbnail?.img_url ||
                '/public/assets/image-placeholder.webp'
              }
              layout='fullWidth'
              alt={b.pst_title}
            ></Image>

            <div className='col-span-1 ml-5 flex flex-col'>
              <h3 className='text-center m-0 text-lg mt-4 truncate-2-lines'>
                {b.pst_title}
              </h3>

              <div className='divider'></div>

              <p className={'truncate-3-lines'}>{b.pst_excerpt}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
