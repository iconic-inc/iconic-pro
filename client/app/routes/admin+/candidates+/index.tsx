import { data, useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';

import {
  bulkHardDeleteCandidates,
  listCandidates,
} from '~/services/candidate.server';
import DashContentHeader from '~/components/DashContentHeader';
import CandidateList from './components/CandidateList';
import {
  ICandidate,
  ICandidateDetails,
} from '~/interfaces/candidate.interface';
import CandidateToolbar from './components/CandidateToolbar';
import CandidateBulkActionBar from './components/CandidateBulkActionBar';
import CandidateConfirmModal from './components/CandidateConfirmModal';
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

    // Fetch customers data with case services
    const candidatesPromise = listCandidates(
      { ...query, status: 'active' },
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
      candidatesPromise,
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      candidatesPromise: Promise.resolve({
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
    };
  }
};

// Action function để xử lý xóa chủ candidate
export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, error: 'Unauthorized' }, { headers });
  }
  const formData = await request.formData();

  try {
    switch (request.method) {
      case 'DELETE':
        const customerIdsString = formData.get('customerIds') as string;
        if (!customerIdsString) {
          return data(
            { success: false, error: 'Missing customer IDs' },
            { headers },
          );
        }

        const customerIds = JSON.parse(customerIdsString);
        if (!Array.isArray(customerIds) || customerIds.length === 0) {
          return data(
            { success: false, error: 'Invalid customer IDs' },
            { headers },
          );
        }
        // Call the bulk delete function
        await bulkHardDeleteCandidates(customerIds, session);

        return data(
          {
            success: true,
            message: `Đã xóa ${customerIds.length} chủ candidate thành công`,
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

export default function CandidateIndex() {
  const { candidatesPromise } = useLoaderData<typeof loader>();

  const [selectedCandidates, setSelectedCandidates] = useState<
    ICandidateDetails[]
  >([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      name: true,
      email: true,
      msisdn: true,
      address: true,
    },
  );

  const navigate = useNavigate();

  return (
    <>
      <DashContentHeader
        title='Quản lý ứng viên'
        actionContent='Thêm ứng viên'
        actionHandler={() => navigate('/admin/candidates/new')}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Toolbar */}
        <CandidateToolbar
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedCandidates.length > 0 && (
          <CandidateBulkActionBar
            selectedCandidates={selectedCandidates}
            handleConfirmBulkDelete={() => setShowDeleteModal(true)}
          />
        )}

        {showDeleteModal && selectedCandidates.length && (
          <CandidateConfirmModal
            setShowDeleteModal={setShowDeleteModal}
            selectedCandidates={selectedCandidates}
            setSelectedCandidates={setSelectedCandidates}
          />
        )}

        <CandidateList
          candidatesPromise={candidatesPromise}
          selectedCandidates={selectedCandidates}
          setSelectedCandidates={setSelectedCandidates}
          visibleColumns={visibleColumns}
        />
      </div>
    </>
  );
}
