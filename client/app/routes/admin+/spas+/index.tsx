import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';

import { bulkDeleteSpas4Admin, listSpas4Admin } from '~/services/spa.server';
import DashContentHeader from '~/components/DashContentHeader';
import SpaList from './components/SpaList';
import { ISpa } from '~/interfaces/spa.interface';
import SpaToolbar from './components/SpaToolbar';
import SpaBulkActionBar from './components/SpaBulkActionBar';
import SpaConfirmModal from './components/SpaConfirmModal';

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

    // Fetch spas data with case services
    const spasPromise = listSpas4Admin(
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
      spasPromise,
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      spasPromise: Promise.resolve({
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      }),
    };
  }
};

// Action function để xử lý xóa chủ spa
export const action = async ({ request }: ActionFunctionArgs) => {
  const auth = await isAuthenticated(request);
  if (!auth) {
    return { success: false, error: 'Unauthorized' };
  }
  const formData = await request.formData();

  try {
    switch (request.method) {
      case 'DELETE':
        const spaIdsString = formData.get('spaIds') as string;
        if (!spaIdsString) {
          return { success: false, error: 'Missing spa IDs' };
        }

        const spaIds = JSON.parse(spaIdsString);
        if (!Array.isArray(spaIds) || spaIds.length === 0) {
          return { success: false, error: 'Invalid spa IDs' };
        }
        // Call the bulk delete function
        await bulkDeleteSpas4Admin(spaIds, auth);

        return {
          success: true,
          message: `Đã xóa ${spaIds.length} chủ spa thành công`,
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

export default function SpaIndex() {
  const { spasPromise } = useLoaderData<typeof loader>();

  const [selectedSpas, setSelectedSpas] = useState<ISpa[]>([]);

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
        title='Quản lý spa'
        actionContent='Thêm spa'
        actionHandler={() => navigate('/admin/spas/new')}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Toolbar */}
        <SpaToolbar
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedSpas.length > 0 && (
          <SpaBulkActionBar
            selectedSpas={selectedSpas}
            handleConfirmBulkDelete={() => setShowDeleteModal(true)}
          />
        )}

        {showDeleteModal && selectedSpas.length && (
          <SpaConfirmModal
            setShowDeleteModal={setShowDeleteModal}
            selectedSpas={selectedSpas}
            setSelectedSpas={setSelectedSpas}
          />
        )}

        <SpaList
          spasPromise={spasPromise}
          selectedSpas={selectedSpas}
          setSelectedSpas={setSelectedSpas}
          visibleColumns={visibleColumns}
        />
      </div>
    </>
  );
}
