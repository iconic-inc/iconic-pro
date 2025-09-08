import { IPageDetail } from '~/interfaces/page.interface';
import { getPublicPeriod } from '~/lib';
import { useMainLoaderData } from '~/lib/useMainLoaderData';
import { Eye } from 'lucide-react';

import './index.css';
import TextRenderer from '../TextRenderer';

export default function PostDetail({ page }: { page: IPageDetail }) {
  return (
    <section id='post-detail' className='col-span-6 text-[--sub4-text]'>
      <article className={`block print:m-0`}>
        <h1 className='!text-3xl font-semibold my-4'>{page.pst_title}</h1>

        <div className='flex md:block items-center border-y py-1'>
          <time className='text-sm' dateTime={getPublicPeriod(page.createdAt)}>
            {getPublicPeriod(page.createdAt)}
          </time>

          <span className='mx-2'>|</span>

          <Eye size={16} className='inline text-[--sub2-text] mr-1' />
          {page.pst_views}
        </div>

        <div className='w-full my-4'>
          <img
            src={page.pst_thumbnail?.img_url}
            alt={page.pst_title}
            className='w-full h-auto'
          />
        </div>

        <TextRenderer content={page.pst_content} />
      </article>
    </section>
  );
}
