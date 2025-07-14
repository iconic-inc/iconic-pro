import { Link } from '@remix-run/react';
import { Image } from '@unpic/react';

export default function Blogs({ blogs }: { blogs: Array<any> }) {
  const mainBlog = blogs.find((b) => b.isMain);
  return (
    <div className='grid grid-cols-12 gap-5 px-4'>
      <article className='beauty-blog col-span-12 row-span-3 flex flex-col'>
        <Link to='/'>
          <div className='aspect-video'>
            <Image
              className='rounded-xl'
              src={mainBlog.image}
              layout='fullWidth'
              alt={mainBlog.title}
            />
          </div>

          <h3 className={'text-center truncate-2-lines'}>{mainBlog.title}</h3>

          <div className='divider'></div>

          <p className={'text-justify truncate-3-lines'}>{mainBlog.preview}</p>
        </Link>
      </article>

      {blogs.map((b, i) =>
        !b.isMain ? (
          <article key={i} className='beauty-blog col-span-12 mt-4'>
            <Link className='h-fit flex flex-col' to='/'>
              <Image
                className='rounded-xl col-span-1'
                src={b.image}
                layout='fullWidth'
                alt={b.title}
              ></Image>

              <div className='col-span-1 ml-5 flex flex-col'>
                <h3 className='text-center m-0 text-lg mt-4 truncate-2-lines'>
                  {b.title}
                </h3>

                <div className='divider'></div>

                <p className={'truncate-3-lines'}>{b.preview}</p>
              </div>
            </Link>
          </article>
        ) : null,
      )}
    </div>
  );
}
