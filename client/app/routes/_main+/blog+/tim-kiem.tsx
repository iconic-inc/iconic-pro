import { useState } from 'react';
import { Form, useLoaderData, useLocation } from '@remix-run/react';
import SideBar from '~/routes/_main+/blog+/components/SideBar';
import { getPosts } from '~/services/page.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Search } from 'lucide-react';
import PostList from '~/components/website/PostList';
import Defer from '~/components/Defer';
import { clientFetch } from '~/lib';
import { IPage } from '~/interfaces/page.interface';
import HandsomeError from '~/components/HandsomeError';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';

  // const searchRes = await searchArticles({ query, page: 1 });
  const pages = await getPosts({ q });
  return {
    searchRes: {
      count: pages.length,
      pages,
    },
    // latestArticles: getPosts(),
  };
};

export default function SearchPage() {
  const { searchRes } = useLoaderData<typeof loader>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);

  const pagesFetcher = (page: number): Promise<Array<IPage>> => {
    return clientFetch(`/api/data?getter=getPosts&page=${page}`);
  };

  return (
    <div className='container grid grid-cols-12 gap-x-6 overflow-hidden max-md:px-2 py-4'>
      <div className='col-span-full'>
        <Form className='relative' method='GET' action='/blog/tim-kiem'>
          <input
            className={`text-xl leading-8 w-full border border-[--sub7-text] focus:outline-none focus:border-main bg-[--main-bg-color] rounded-full py-1 md:py-2 px-5`}
            disabled={false}
            value={input}
            name='q'
            placeholder='Tìm kiếm...'
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            className='absolute right-4 top-2'
            title='Tìm kiếm'
            type='submit'
          >
            <Search className={`text-main`} />
          </button>
        </Form>

        <p className='text-xl text-[--sub6-text] my-5'>
          <span className='font-medium text-[--sub2-text]'>
            {searchRes.pages.length || 0}
          </span>{' '}
          kết quả phù hợp
        </p>
      </div>

      <div className='col-span-full'>
        <PostList
          posts={searchRes.pages}
          postsGetter={async (post) => {
            const posts = await pagesFetcher(post);
            return posts;
          }}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <HandsomeError />;
}
