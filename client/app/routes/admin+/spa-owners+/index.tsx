import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';

import {
  bulkDeleteSpaOwners4Admin,
  listSpaOwners4Admin,
} from '~/services/spaOwner.server';
import DashContentHeader from '~/components/DashContentHeader';
import SpaOwnerList from './_components/SpaOwnerList';
import { ISpaOwnerDetails } from '~/interfaces/spaOwner.interface';
import SpaOwnerToolbar from './_components/SpaOwnerToolbar';
import SpaOwnerBulkActionBar from './_components/SpaOwnerBulkActionBar';
import SpaOwnerConfirmModal from './_components/SpaOwnerConfirmModal';

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
    const spaOwnersPromise = listSpaOwners4Admin(
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
      spaOwnersPromise,
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      spaOwnersPromise: Promise.resolve({
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
        const customerIdsString = formData.get('customerIds') as string;
        if (!customerIdsString) {
          return { success: false, error: 'Missing customer IDs' };
        }

        const customerIds = JSON.parse(customerIdsString);
        if (!Array.isArray(customerIds) || customerIds.length === 0) {
          return { success: false, error: 'Invalid customer IDs' };
        }
        // Call the bulk delete function
        await bulkDeleteSpaOwners4Admin(customerIds, auth);

        return {
          success: true,
          message: `Đã xóa ${customerIds.length} chủ spa thành công`,
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

export default function SpaOwnerIndex() {
  const { spaOwnersPromise } = useLoaderData<typeof loader>();

  const [selectedSpaOwners, setSelectedSpaOwners] = useState<
    ISpaOwnerDetails[]
  >([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<
    Record<
      'usr_firstName' | 'usr_msisdn' | 'usr_email' | 'usr_address',
      boolean
    >
  >({
    usr_firstName: true,
    usr_msisdn: true,
    usr_email: true,
    usr_address: true,
  });

  const navigate = useNavigate();

  return (
    <>
      <DashContentHeader
        title='Quản lý chủ spa'
        actionContent='Thêm chủ spa'
        actionHandler={() => navigate('/admin/spa-owners/new')}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Toolbar */}
        <SpaOwnerToolbar
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedSpaOwners.length > 0 && (
          <SpaOwnerBulkActionBar
            selectedSpaOwners={selectedSpaOwners}
            handleConfirmBulkDelete={() => setShowDeleteModal(true)}
          />
        )}

        {showDeleteModal && selectedSpaOwners.length && (
          <SpaOwnerConfirmModal
            setShowDeleteModal={setShowDeleteModal}
            selectedSpaOwners={selectedSpaOwners}
            setSelectedSpaOwners={setSelectedSpaOwners}
          />
        )}

        <SpaOwnerList
          spaOwnersPromise={spaOwnersPromise}
          selectedSpaOwners={selectedSpaOwners}
          setSelectedSpaOwners={setSelectedSpaOwners}
          visibleColumns={visibleColumns}
        />
      </div>
    </>
  );
}
