import { Link } from '@remix-run/react';
import { Image } from '@unpic/react';

export default function Blogs({ blogs }: { blogs: Array<any> }) {
  const mainBlog = blogs.find((b) => b.isMain);
  return (
    <div className='grid grid-cols-12 gap-5 max-lg:px-4'>
      <article className='beauty-blog col-span-12 lg:col-span-6 row-span-3 flex flex-col'>
        <Link to='/'>
          <div className='aspect-video'>
            <Image
              className='rounded-xl'
              src={mainBlog.image}
              layout='fullWidth'
              alt={mainBlog.title}
            />
          </div>

          <h3 className={'text-center'}>{mainBlog.title}</h3>

          <div className='divider'></div>

          <p
            className={'text-justify'}
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {mainBlog.preview}
          </p>
        </Link>
      </article>

      {blogs.map((b, i) =>
        !b.isMain ? (
          <article
            key={i}
            className='beauty-blog col-span-12 lg:col-span-6 max-lg:mt-4'
          >
            <Link
              className='block grid grid-cols-2 h-fit max-sm:flex flex-col'
              to='/'
            >
              <Image
                className='rounded-xl col-span-1'
                src={b.image}
                layout='fullWidth'
                alt={b.title}
              ></Image>

              <div className='col-span-1 ml-5 max-md:flex flex-col'>
                <h3 className='m-0 text-lg max-md:mt-4 truncate-2-lines'>
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
