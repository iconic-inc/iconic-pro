import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';

import {
  bulkDeleteReviews4Admin,
  listReviews4Admin,
} from '~/services/review.server';
import DashContentHeader from '~/components/DashContentHeader';
import ReviewList from './components/ReviewList';
import { IReview } from '~/interfaces/review.interface';
import ReviewToolbar from './components/ReviewToolbar';
import ReviewBulkActionBar from './components/ReviewBulkActionBar';
import ReviewConfirmModal from './components/ReviewConfirmModal';

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
    const reviewsPromise = listReviews4Admin(
      { ...query, status: 'approved' },
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
      reviewsPromise,
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      reviewsPromise: Promise.resolve({
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
    };
  }
};

// Action function để xử lý xóa chủ review
export const action = async ({ request }: ActionFunctionArgs) => {
  const auth = await isAuthenticated(request);
  if (!auth) {
    return { success: false, error: 'Unauthorized' };
  }
  const formData = await request.formData();

  try {
    switch (request.method) {
      case 'DELETE':
        const customerIdsString = formData.get('customerIds') as string;
        if (!customerIdsString) {
          return { success: false, error: 'Missing customer IDs' };
        }

        const customerIds = JSON.parse(customerIdsString);
        if (!Array.isArray(customerIds) || customerIds.length === 0) {
          return { success: false, error: 'Invalid customer IDs' };
        }
        // Call the bulk delete function
        await bulkDeleteReviews4Admin(customerIds, auth);

        return {
          success: true,
          message: `Đã xóa ${customerIds.length} chủ review thành công`,
        };

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

export default function ReviewIndex() {
  const { reviewsPromise } = useLoaderData<typeof loader>();

  const [selectedReviews, setSelectedReviews] = useState<IReview[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      name: true,
      owner: true,
      phone: true,
      address: true,
    },
  );

  const navigate = useNavigate();

  return (
    <>
      <DashContentHeader
        title='Quản lý review'
        actionContent='Thêm review'
        actionHandler={() => navigate('/admin/reviews/new')}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Toolbar */}
        <ReviewToolbar
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedReviews.length > 0 && (
          <ReviewBulkActionBar
            selectedReviews={selectedReviews}
            handleConfirmBulkDelete={() => setShowDeleteModal(true)}
          />
        )}

        {showDeleteModal && selectedReviews.length && (
          <ReviewConfirmModal
            setShowDeleteModal={setShowDeleteModal}
            selectedReviews={selectedReviews}
            setSelectedReviews={setSelectedReviews}
          />
        )}

        <ReviewList
          reviewsPromise={reviewsPromise}
          selectedReviews={selectedReviews}
          setSelectedReviews={setSelectedReviews}
          visibleColumns={visibleColumns}
        />
      </div>
    </>
  );
}
