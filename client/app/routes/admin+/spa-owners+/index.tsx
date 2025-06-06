import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { LoaderFunctionArgs, ActionFunctionArgs, data } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';

import { bulkDeleteSpaOwners, listSpaOwners } from '~/services/spaOwner.server';
import DashContentHeader from '~/components/admin/DashContentHeader';
import SpaOwnerList from './components/SpaOwnerList';
import { ISpaOwnerDetails } from '~/interfaces/spaOwner.interface';
import SpaOwnerToolbar from './components/SpaOwnerToolbar';
import SpaOwnerBulkActionBar from './components/SpaOwnerBulkActionBar';
import SpaOwnerConfirmModal from './components/SpaOwnerConfirmModal';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
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

    // Fetch spaOwners data with case services
    const spaOwnersPromise = listSpaOwners(
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
  const { session, headers } = await isAuthenticated(request);

  if (!session) {
    return data({ success: false, error: 'Unauthorized' }, { headers });
  }

  const formData = await request.formData();

  try {
    switch (request.method) {
      case 'DELETE':
        const spaOwnerIdsString = formData.get('spaOwnerIds') as string;
        if (!spaOwnerIdsString) {
          return data(
            { success: false, error: 'Missing spaOwner IDs' },
            { headers },
          );
        }

        const spaOwnerIds = JSON.parse(spaOwnerIdsString);
        if (!Array.isArray(spaOwnerIds) || spaOwnerIds.length === 0) {
          return data(
            { success: false, error: 'Invalid spaOwner IDs' },
            { headers },
          );
        }
        // Call the bulk delete function
        await bulkDeleteSpaOwners(spaOwnerIds, session);

        return data(
          {
            success: true,
            message: `Đã xóa ${spaOwnerIds.length} chủ spa thành công`,
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
