import { Link, useSearchParams } from '@remix-run/react';
import { ISpa } from '~/interfaces/spa.interface';
import Defer from '~/components/Defer';
import SpaPagination from './ReviewPagination';
import { IResponseList } from '~/interfaces/app.interface';

export default function SpaList({
  spasPromise,
  selectedSpas,
  setSelectedSpas,
  visibleColumns,
}: {
  spasPromise: Promise<IResponseList<ISpa>>;
  selectedSpas: ISpa[];
  setSelectedSpas: (spas: ISpa[]) => void;
  visibleColumns: Record<string, boolean>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const handleSelectAll = (cases: ISpa[]) => {
    if (selectedSpas.length === cases.length) {
      setSelectedSpas([]);
    } else {
      setSelectedSpas(cases);
    }
  };

  const handleSpaSelect = (spa: ISpa) => {
    if (selectedSpas.some((item) => item.id === spa.id)) {
      setSelectedSpas(selectedSpas.filter((spa) => spa.id !== spa.id));
    } else {
      setSelectedSpas([...selectedSpas, spa]);
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

  // Define table columns for the SpaList component
  const columns = [
    {
      key: 'name',
      title: 'Tên spa',
      sortField: 'sp_name',
      visible: visibleColumns.name,
      render: (spa: ISpa) => (
        <Link
          to={`/admin/spas/${spa.id}`}
          className='block w-full h-full hover:text-red-500'
        >
          {spa.sp_name}
        </Link>
      ),
    },
    {
      key: 'owner',
      title: 'Chủ sở hữu',
      sortField: 'sp_owner',
      visible: visibleColumns.owner,
      render: (spa: ISpa) => (
        <div className='flex items-center'>
          {spa.sp_owner?.spo_user.usr_firstName}{' '}
          {spa.sp_owner?.spo_user.usr_lastName}
        </div>
      ),
    },
    {
      key: 'phone',
      title: 'Điện thoại',
      sortField: 'sp_phone',
      visible: visibleColumns.phone,
      render: (spa: ISpa) => (
        <div className='flex items-center'>{spa.sp_phone}</div>
      ),
    },
    {
      key: 'address',
      title: 'Địa chỉ',
      sortField: 'sp_address',
      visible: visibleColumns.address,
      render: (spa: ISpa) => (
        <div className='flex items-center'>
          {spa.sp_address.formattedAddress}
        </div>
      ),
    },
  ];

  return (
    <Defer resolve={spasPromise}>
      {(response) => {
        const { data: spas, pagination } = response;

        if (!spas || spas.length === 0) {
          // Empty State
          return (
            <div className='py-12 flex flex-col items-center justify-center'>
              <div className='bg-gray-100 rounded-full p-6 mb-4'>
                <span className='material-symbols-outlined text-5xl text-gray-400'>
                  person_off
                </span>
              </div>
              <h3 className='text-xl font-medium text-gray-800 mb-2'>
                Chưa có spa nào
              </h3>
              <p className='text-gray-500 mb-6 text-center max-w-md'>
                Thêm spa đầu tiên của bạn để bắt đầu quản lý thông tin của họ.
              </p>
              <Link
                to='/admin/spas/new'
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-sm'>add</span>
                Thêm spa
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
                          selectedSpas.length === spas.length && spas.length > 0
                        }
                        onChange={() => handleSelectAll(spas)}
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
                  {spas.map((spa) => (
                    <tr key={spa.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <input
                          type='checkbox'
                          checked={selectedSpas.some(
                            (item) => item.id === spa.id,
                          )}
                          onChange={() => handleSpaSelect(spa)}
                          className='rounded text-blue-500'
                        />
                      </td>

                      {columns
                        .filter((column) => column.visible)
                        .map((column) => (
                          <td key={column.key as string} className='px-4 py-4'>
                            {column.render(spa)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SpaPagination pagination={pagination} />
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
