import { data, useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';

import { deleteMyJobPost, listMyJobPosts } from '~/services/jobPost.server';
import DashContentHeader from '~/components/DashContentHeader';
import JobPostList from './components/JobPostList';
import { IJobPostDetails } from '~/interfaces/jobPost.interface';
import JobPostToolbar from './components/JobPostToolbar';
import JobPostBulkActionBar from './components/JobPostBulkActionBar';
import JobPostConfirmModal from './components/JobPostConfirmModal';
import { parseAuthCookie } from '~/services/cookie.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const auth = await parseAuthCookie(request);
    if (!auth) {
      throw new Error('Unauthorized');
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const searchQuery = url.searchParams.get('search') || '';

    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder =
      (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    // Build a clean query object that matches the expected API format
    const query: any = {};

    // Search query - used for name, phone, email search
    if (searchQuery) {
      query.search = searchQuery;
    }
    // Pagination options
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    // Fetch job posts data with case services
    const jobPostsPromise = listMyJobPosts({ ...query }, options, auth).catch(
      (fallbackError) => {
        console.error('Fallback error:', fallbackError);
        return {
          data: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        };
      },
    );

    return {
      jobPostsPromise,
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      jobPostsPromise: Promise.resolve({
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
    };
  }
};

// Action function để xử lý xóa chủ jobPost
export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, error: 'Unauthorized' }, { headers });
  }
  const formData = await request.formData();

  try {
    switch (request.method) {
      case 'DELETE':
        const jobPostIdsString = formData.get('jobPostIds') as string;
        if (!jobPostIdsString) {
          return data({ success: false, error: 'Thiếu ' }, { headers });
        }

        const jobPostIds = JSON.parse(jobPostIdsString);
        if (!Array.isArray(jobPostIds) || jobPostIds.length === 0) {
          return data(
            { success: false, error: 'Invalid jobPost IDs' },
            { headers },
          );
        }
        let count = 0;
        for (const jobPostId of jobPostIds) {
          await deleteMyJobPost(jobPostId, session);
          count++;
        }
        return data(
          {
            success: true,
            message: `Xóa ${count} tin tuyển dụng thành công`,
          },
          { headers },
        );

      default:
        return data(
          { success: false, error: 'Method not allowed' },
          { headers },
        );
    }
  } catch (error: any) {
    console.error('Action error:', error);
    return data(
      {
        success: false,
        error: error.message || 'Có lỗi xảy ra khi thực hiện hành động',
      },
      { headers },
    );
  }
};

export default function JobPostIndex() {
  const { jobPostsPromise } = useLoaderData<typeof loader>();

  const [selectedJobPosts, setSelectedJobPosts] = useState<IJobPostDetails[]>(
    [],
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      title: true,
      ownerName: true,
      createdAt: true,
      updatedAt: true,
    },
  );

  const navigate = useNavigate();

  return (
    <>
      <DashContentHeader
        title='Quản lý Tin tuyển dụng'
        actionContent='Thêm Tin tuyển dụng'
        actionHandler={() => navigate('/owner/job-posts/new')}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Toolbar */}
        <JobPostToolbar
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedJobPosts.length > 0 && (
          <JobPostBulkActionBar
            selectedJobPosts={selectedJobPosts}
            handleConfirmBulkDelete={() => setShowDeleteModal(true)}
          />
        )}

        {showDeleteModal && selectedJobPosts.length && (
          <JobPostConfirmModal
            setShowDeleteModal={setShowDeleteModal}
            selectedJobPosts={selectedJobPosts}
            setSelectedJobPosts={setSelectedJobPosts}
          />
        )}

        <JobPostList
          jobPostsPromise={jobPostsPromise}
          selectedJobPosts={selectedJobPosts}
          setSelectedJobPosts={setSelectedJobPosts}
          visibleColumns={visibleColumns}
        />
      </div>
    </>
  );
}
