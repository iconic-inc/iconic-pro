import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import Defer from '~/components/Defer';
import HandsomeError from '~/components/HandsomeError';
import SupportPopup from '~/components/website/SupportPopup';
import { listJobPostsPublic } from '~/services/jobPost.server';
import JobPostCard from '~/widgets/JobPostCard';

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || '';
  const page = +url.searchParams.get('page')! || 1;

  const jobposts = listJobPostsPublic({ keyword }, { page });

  return {
    keyword,
    page,
    jobposts,
  };
};

export default function SearchPage() {
  const { jobposts } = useLoaderData<typeof loader>();
  const [askJobPost, setAskJobPost] = useState<any | null>(null);

  return (
    <>
      <Defer
        resolve={jobposts}
        fallback={
          <div className='w-full h-96 flex items-center justify-center'>
            Loading...
          </div>
        }
      >
        {(jpos) =>
          jpos.data.map((jpo, i) => (
            <JobPostCard
              jobpost={jpo}
              key={i}
              index={i + 1}
              openPopup={(jpo) => setAskJobPost(jpo)}
            />
          ))
        }
      </Defer>

      {askJobPost && (
        <SupportPopup
          jobpost={askJobPost}
          closePopup={() => setAskJobPost(null)}
        />
      )}
    </>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
