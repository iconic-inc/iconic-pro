import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import HandsomeError from '~/components/HandsomeError';
import JobPostInformation from '~/components/website/JobPostInformation';
import { JOB_POST } from '~/constants/jobPost.constant';
import { parseAuthCookie } from '~/services/cookie.server';
import { getAppliedJobApp } from '~/services/jobApplication.server';
import { getJobPostPublicById } from '~/services/jobPost.server';
import JobPostOverview from '~/widgets/JobPostOverview';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const jobPostId = params.id;
  if (!jobPostId) throw new Response(null, { status: 404 });

  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const [jobPost, appliedApplication] = await Promise.all([
      getJobPostPublicById(jobPostId),
      getAppliedJobApp(jobPostId, auth).catch(() => null), // Handle case where no application exists
    ]);
    return {
      jobPost,
      appliedApplication,
    };
  } catch (error) {
    console.error('Error loading job post:', error);
    throw new Response('Error loading job post', { status: 500 });
  }
};

export default function JobPostDetail() {
  const { jobPost, appliedApplication } = useLoaderData<typeof loader>();

  return (
    <div className='col-span-12 space-y-6'>
      <JobPostOverview
        jobpost={jobPost}
        appliedApplication={appliedApplication}
        breadscrum={[
          {
            label:
              Object.values(JOB_POST.TYPE).find(
                (m) => m.slug === jobPost.jpo_type,
              )?.name || 'Việc làm',
            path: `/viec-lam?type=${jobPost.jpo_type}`,
          },
          {
            label: jobPost.jpo_title,
            path: `/viec-lam/d/${jobPost.id}`,
          },
        ]}
      />

      <div className='container flex flex-col-reverse md:flex-row items-start gap-6 pb-6'>
        <JobPostInformation jobpost={jobPost} />

        {!appliedApplication && <Outlet />}
      </div>
    </div>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
