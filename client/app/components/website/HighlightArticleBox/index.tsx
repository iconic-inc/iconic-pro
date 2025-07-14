import { Link } from '@remix-run/react';
import { ArrowRight, Film } from 'lucide-react';
import { IPage } from '~/interfaces/page.interface';
import { useEffect, useState } from 'react';
import { ICategory } from '~/interfaces/category.interface';

export default function HighlightPageBox({
  category,
  // pages = [],
  pagesGetter,
}: {
  category: ICategory;
  pages?: Array<IPage>;
  pagesGetter: () => Promise<Array<IPage>>;
}) {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Array<IPage>>([]);

  useEffect(() => {
    pagesGetter().then((pages) => {
      setPages(pages);
      setLoading(false);
    });
  }, []);

  return (
    <section className='bg-main col-span-full'>
      <div className='container p-4 text-white'>
        <div className='flex justify-between w-full overflow-hidden'>
          <h2 className='font-bold text-xl'>
            <Link
              to={`/danh-muc/${category.cat_url}`}
              className='flex items-center hover:text-white/80'
            >
              <Film size={20} className='mr-2' />
              {category.cat_name}
            </Link>
          </h2>

          <Link
            className='text-sm hover:text-white/80'
            to={`/danh-muc/${category.cat_url}`}
          >
            Xem thêm
            <ArrowRight className='inline-block' />
          </Link>
        </div>

        <div className='grid grid-cols-12 gap-x-4 md:gap-x-6 mt-4'>
          {loading ? (
            <div>Loading...</div>
          ) : (
            pages.slice(0, 4).map((page, index) => (
              <article
                className='col-span-6 max-md:mb-2 md:col-span-3 flex-col text-white'
                key={index}
              >
                <figure className='hover:text-white/80'>
                  <Link to={`/blog/${page.pst_slug}`} className='thumb-wrapper'>
                    <img
                      src={page.pst_thumbnail?.img_url}
                      alt={page.pst_title}
                      title={page.pst_title}
                    />
                  </Link>

                  <div className='content flex flex-col col-span-4'>
                    <h2
                      className={`text-base text-inherit mt-2 font-semibold`}
                      title={page.pst_title}
                    >
                      <Link to={`/blog/${page.pst_slug}`}>
                        {page.pst_title}
                      </Link>
                    </h2>
                  </div>
                </figure>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
