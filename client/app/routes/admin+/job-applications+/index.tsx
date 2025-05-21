import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';

import { listJobApplications } from '~/services/jobApplication.server';
import DashContentHeader from '~/components/DashContentHeader';
import JobApplicationList from './components/JobApplicationList';
import {
  IJobApplication,
  IJobApplicationDetails,
} from '~/interfaces/jobApplication.interface';
import JobApplicationToolbar from './components/JobApplicationToolbar';
import JobApplicationBulkActionBar from './components/JobApplicationBulkActionBar';
import JobApplicationConfirmModal from './components/JobApplicationConfirmModal';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const auth = await isAuthenticated(request);
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

    // Fetch customers data with case services
    const jobAppsPromise = listJobApplications(
      { ...query },
      options,
      auth,
    ).catch((fallbackError) => {
      console.error('Fallback error:', fallbackError);
      return {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    });

    return {
      jobAppsPromise,
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      jobAppsPromise: Promise.resolve({
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
    };
  }
};

// Action function để xử lý xóa chủ jobApp
export const action = async ({ request }: ActionFunctionArgs) => {
  const auth = await isAuthenticated(request);
  if (!auth) {
    return { success: false, error: 'Unauthorized' };
  }
  const formData = await request.formData();

  try {
    switch (request.method) {
      default:
        return { success: false, error: 'Method not allowed' };
    }
  } catch (error: any) {
    console.error('Action error:', error);
    return {
      success: false,
      error: error.message || 'Có lỗi xảy ra khi thực hiện hành động',
    };
  }
};

export default function JobApplicationIndex() {
  const { jobAppsPromise } = useLoaderData<typeof loader>();

  const [selectedJobApplications, setSelectedJobApplications] = useState<
    IJobApplicationDetails[]
  >([]);

  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      postTitle: true,
      candidateName: true,
      ownerName: true,
      status: true,
    },
  );

  const navigate = useNavigate();

  return (
    <>
      <DashContentHeader title='Quản lý Đơn ứng tuyển' />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Toolbar */}
        <JobApplicationToolbar
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        <JobApplicationList
          jobAppsPromise={jobAppsPromise}
          selectedJobApplications={selectedJobApplications}
          setSelectedJobApplications={setSelectedJobApplications}
          visibleColumns={visibleColumns}
        />
      </div>
    </>
  );
}
