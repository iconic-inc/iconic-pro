import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';

import { IPage } from '~/interfaces/page.interface';
import VerticalPost from '~/components/website/Post/Vertical';
import HorizontalPost from '~/components/website/Post/Horizontal';
import { getPosts } from '~/services/page.server';
import { Link, useLoaderData } from '@remix-run/react';
import Defer from '~/components/Defer';
import PostList from '~/components/website/PostList';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css',
    },
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css',
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const posts = getPosts();

    return { posts };
  } catch (error) {
    throw new Error('Failed to load data', (error as any).message);
  }
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className='container gap-y-20 py-4 mb-6'>
      <div className='col-span-full grid grid-cols-12 gap-y-8 md:gap-y-20'>
        <Defer resolve={posts}>
          {(p) => <Overview posts={p.slice(0, 4)} />}
        </Defer>

        <div className='col-span-full'>
          <Defer resolve={posts}>
            {(p) => <PostList posts={p.slice(4)} postsGetter={() => posts} />}
          </Defer>
        </div>
      </div>
    </div>
  );
}

const Overview = ({ posts }: { posts: IPage[] }) => {
  if (!posts || !posts.length) {
    return (
      <div className='col-span-full text-center'>
        <p className='text-gray-500'>Không có bài viết nào được đăng tải.</p>
        <Link to='/blog' className='text-blue-500 hover:underline'>
          Xem tất cả bài viết
        </Link>
      </div>
    );
  }

  return (
    !!posts.length && (
      <div className='col-span-full grid grid-cols-12 gap-y-4 md:gap-6 mt-5'>
        <HorizontalPost
          post={posts[0]}
          detailed
          important
          colSpan={10}
          ratio='4/6'
          className='col-span-full'
        />

        <div className='col-span-full border-b md:hidden'></div>

        {posts.slice(1).map((a, i) => (
          <VerticalPost
            post={a}
            key={i}
            className='col-span-3 max-md:col-span-6 max-md:px-2'
          />
        ))}
      </div>
    )
  );
};
