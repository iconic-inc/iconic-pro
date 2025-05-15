import { Link, useSearchParams } from '@remix-run/react';
import { ISpaOwner, ISpaOwnerDetails } from '~/interfaces/spaOwner.interface';
import Defer from '~/components/Defer';
import SpaOwnerPagination from './SpaOwnerPagination';
import { IResponseList } from '~/interfaces/app.interface';
import { IUser } from '~/interfaces/user.interface';

export default function SpaOwnerList({
  spaOwnersPromise,
  selectedSpaOwners,
  setSelectedSpaOwners,
  visibleColumns,
}: {
  spaOwnersPromise: Promise<IResponseList<ISpaOwnerDetails>>;
  selectedSpaOwners: ISpaOwnerDetails[];
  setSelectedSpaOwners: (spaOwners: ISpaOwnerDetails[]) => void;
  visibleColumns: Record<string, boolean>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const handleSelectAll = (cases: ISpaOwnerDetails[]) => {
    if (selectedSpaOwners.length === cases.length) {
      setSelectedSpaOwners([]);
    } else {
      setSelectedSpaOwners(cases);
    }
  };

  const handleSpaOwnerSelect = (spaOwner: ISpaOwnerDetails) => {
    if (selectedSpaOwners.some((item) => item.id === spaOwner.id)) {
      setSelectedSpaOwners(
        selectedSpaOwners.filter((owner) => owner.id !== spaOwner.id),
      );
    } else {
      setSelectedSpaOwners([...selectedSpaOwners, spaOwner]);
    }
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      searchParams.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      searchParams.set('sortBy', column);
      searchParams.set('sortOrder', 'desc');
    }
    setSearchParams(searchParams);
  };

  // Define table columns for the SpaOwnerList component
  const columns = [
    {
      key: 'usr_firstName',
      title: 'Họ tên',
      sortField: 'spo_user.usr_firstName',
      visible: visibleColumns.usr_firstName,
      render: (owner: ISpaOwnerDetails) => (
        <Link
          to={`/admin/spa-owners/${owner.id}`}
          className='text-gray-900 hover:text-red-500'
        >
          <div className='flex items-center'>
            <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3'>
              {owner.spo_user.usr_firstName.charAt(0)}
            </div>
            <div>
              <div className='text-sm font-medium text-inherit'>
                {`${owner.spo_user.usr_firstName} ${owner.spo_user.usr_lastName}`}
              </div>

              <div className='text-xs text-gray-500'>
                {owner.spo_user.usr_birthdate
                  ? new Date(owner.spo_user.usr_birthdate).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </Link>
      ),
    },
    {
      key: 'usr_msisdn',
      title: 'Điện thoại',
      sortField: 'spo_user.usr_msisdn',
      visible: visibleColumns.usr_msisdn,
      render: (owner: ISpaOwnerDetails) => (
        <div className='text-sm text-gray-900'>
          {owner.spo_user.usr_msisdn || 'N/A'}
        </div>
      ),
    },
    {
      key: 'usr_email',
      title: 'Email',
      sortField: 'spo_user.usr_email',
      visible: visibleColumns.usr_email,
      render: (owner: ISpaOwnerDetails) => (
        <div className='text-sm text-gray-900'>
          {owner.spo_user.usr_email || 'N/A'}
        </div>
      ),
    },
    {
      key: 'usr_address',
      title: 'Địa chỉ',
      sortField: 'spo_user.usr_address',
      visible: visibleColumns.usr_address,
      render: (owner: ISpaOwnerDetails) => (
        <div className='text-sm text-gray-900 max-w-xs truncate'>
          {owner.spo_user.usr_address || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <Defer resolve={spaOwnersPromise}>
      {(response) => {
        const { data: spaOwners, pagination } = response;
        console.log(spaOwners);

        if (!spaOwners || spaOwners.length === 0) {
          // Empty State
          return (
            <div className='py-12 flex flex-col items-center justify-center'>
              <div className='bg-gray-100 rounded-full p-6 mb-4'>
                <span className='material-symbols-outlined text-5xl text-gray-400'>
                  person_off
                </span>
              </div>
              <h3 className='text-xl font-medium text-gray-800 mb-2'>
                Chưa có chủ spa nào
              </h3>
              <p className='text-gray-500 mb-6 text-center max-w-md'>
                Thêm chủ spa đầu tiên của bạn để bắt đầu quản lý thông tin của
                họ.
              </p>
              <Link
                to='/admin/spa-owners/new'
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-sm'>add</span>
                Thêm chủ spa
              </Link>
            </div>
          );
        }

        return (
          <>
            {/* Desktop view */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      <input
                        type='checkbox'
                        checked={
                          selectedSpaOwners.length === spaOwners.length &&
                          spaOwners.length > 0
                        }
                        onChange={() => handleSelectAll(spaOwners)}
                        className='rounded text-blue-500'
                      />
                    </th>
                    {columns
                      .filter((column) => column.visible)
                      .map((column) => (
                        <th
                          key={column.key as string}
                          className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                          onClick={() => {
                            // Use the sortField defined in the column definition
                            const sortKey = column.sortField || column.key;
                            handleSortChange(sortKey as string);
                          }}
                        >
                          <div className='flex items-center justify-between'>
                            <span>{column.title}</span>
                            <span className='w-4 h-4 inline-flex justify-center'>
                              {/* Check if this column is currently being sorted by */}
                              {sortBy === (column.sortField || column.key) && (
                                <span className='material-symbols-outlined text-xs'>
                                  {sortOrder === 'asc'
                                    ? 'arrow_upward'
                                    : 'arrow_downward'}
                                </span>
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {spaOwners.map((spaOwner) => (
                    <tr key={spaOwner.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <input
                          type='checkbox'
                          checked={selectedSpaOwners.some(
                            (item) => item.id === spaOwner.id,
                          )}
                          onChange={() => handleSpaOwnerSelect(spaOwner)}
                          className='rounded text-blue-500'
                        />
                      </td>

                      {columns
                        .filter((column) => column.visible)
                        .map((column) => (
                          <td key={column.key as string} className='px-4 py-4'>
                            {column.render(spaOwner)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SpaOwnerPagination pagination={pagination} />
          </>
        );
      }}
    </Defer>
  );
}

interface Column<T> {
  key: keyof T;
  title: string;
  sortField?: keyof T;
  visible?: boolean;
}
