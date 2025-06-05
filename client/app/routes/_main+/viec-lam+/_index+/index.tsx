import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Defer from '~/components/Defer';
import HandsomeError from '~/components/HandsomeError';
import Pagination from '~/components/website/Pagination';
import { listJobPostsPublic } from '~/services/jobPost.server';
import JobPostCard from '~/widgets/JobPostCard';

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  // const { type: jobPostType } = params;
  const url = new URL(request.url);
  const jobPostType = url.searchParams.get('type') || 'all'; // Default to 'all' if not specified
  const keyword = url.searchParams.get('q') || '';
  const page = +url.searchParams.get('page')! || 1;
  const salaryFrom = url.searchParams.get('salaryFrom') || '';
  const salaryTo = url.searchParams.get('salaryTo') || '';

  const jobposts = listJobPostsPublic(
    { keyword, type: jobPostType, salaryFrom, salaryTo },
    { page, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
  ).catch((error) => {
    console.error('Error loading job posts:', error);
    return { success: false, message: 'Có lỗi xảy ra khi tải tin tuyển dụng.' };
  });

  return {
    jobPostType,
    keyword,
    page,
    jobposts,
  };
};

export default function SearchPage() {
  const { jobposts } = useLoaderData<typeof loader>();

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
        {({ data, pagination }) => (
          <>
            {data.map((jpo, i) => (
              <JobPostCard jobpost={jpo} key={i} index={i + 1} />
            ))}

            <Pagination pagination={pagination} />
          </>
        )}
      </Defer>
    </>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
