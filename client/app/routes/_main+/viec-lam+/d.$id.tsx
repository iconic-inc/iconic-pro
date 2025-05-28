import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';

import HandsomeError from '~/components/HandsomeError';
import JobPostInformation from '~/components/website/JobPostInformation';
import SupportPopup from '~/components/website/SupportPopup';
import { JOB_POST } from '~/constants/jobPost.constant';
import { IJobPostDetails } from '~/interfaces/jobPost.interface';
import { getJobPostPublicById } from '~/services/jobPost.server';
import JobPostOverview from '~/widgets/JobPostOverview';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const jobPostId = params.id;
  if (!jobPostId) throw new Response(null, { status: 404 });

  const jobPost = await getJobPostPublicById(jobPostId);
  if (!jobPost) throw new Response(null, { status: 404 });

  return { jobPost };
};

export default function JobPostDetail() {
  const { jobPost } = useLoaderData<typeof loader>();

  const [askJobPost, setAskJobPost] = useState<IJobPostDetails | null>(null);

  return (
    <>
      <JobPostOverview
        jobpost={jobPost}
        images={[
          'https://static.kiddihub.com/images/b6ZX7jQsSQrPgXUw0-457692217122154487730247549400325114343870504n.jpg',
          'https://static.kiddihub.com/images/b6ZX7jQsSQrPgXUw0-457692217122154487730247549400325114343870504n.jpg',
          'https://static.kiddihub.com/images/b6ZX7jQsSQrPgXUw0-457692217122154487730247549400325114343870504n.jpg',
          'https://static.kiddihub.com/images/b6ZX7jQsSQrPgXUw0-457692217122154487730247549400325114343870504n.jpg',
          'https://static.kiddihub.com/images/b6ZX7jQsSQrPgXUw0-457692217122154487730247549400325114343870504n.jpg',
        ]}
        breadscrum={[
          {
            label:
              Object.values(JOB_POST.TYPE).find(
                (m) => m.slug === jobPost.jpo_type,
              )?.name || 'Việc làm',
            path: `/viec-lam`,
          },
          {
            label: jobPost.jpo_title,
            path: `/viec-lam/d/${jobPost.id}`,
          },
        ]}
      />

      <div className='container py-6'>
        <JobPostInformation
          jobpost={jobPost}
          openSupport={(s) => setAskJobPost(jobPost)}
        />
      </div>

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
