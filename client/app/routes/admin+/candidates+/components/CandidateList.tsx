import { Link, useSearchParams } from '@remix-run/react';
import { ICandidateDetails } from '~/interfaces/candidate.interface';
import Defer from '~/components/Defer';
import CandidatePagination from './CandidatePagination';
import { IResponseList } from '~/interfaces/app.interface';
import { IUser } from '~/interfaces/user.interface';

export default function CandidateList({
  candidatesPromise,
  selectedCandidates,
  setSelectedCandidates,
  visibleColumns,
}: {
  candidatesPromise: Promise<IResponseList<ICandidateDetails>>;
  selectedCandidates: ICandidateDetails[];
  setSelectedCandidates: (candidates: ICandidateDetails[]) => void;
  visibleColumns: Record<string, boolean>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const handleSelectAll = (cases: ICandidateDetails[]) => {
    if (selectedCandidates.length === cases.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(cases);
    }
  };

  const handleCandidateSelect = (candidate: ICandidateDetails) => {
    if (selectedCandidates.some((item) => item.id === candidate.id)) {
      setSelectedCandidates(
        selectedCandidates.filter((candidate) => candidate.id !== candidate.id),
      );
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
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

  // Define table columns for the CandidateList component
  const columns = [
    {
      key: 'name',
      title: 'Họ tên',
      sortField: 'can_user.usr_firstName',
      visible: visibleColumns.name,
      render: (candidate: ICandidateDetails) => (
        <Link
          to={`/admin/candidates/${candidate.id}`}
          className='text-gray-900 hover:text-red-500'
        >
          <div className='flex items-center'>
            <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3'>
              {candidate.can_user.usr_firstName.charAt(0)}
            </div>
            <div>
              <div className='text-sm font-medium text-inherit'>
                {`${candidate.can_user.usr_firstName} ${candidate.can_user.usr_lastName}`}
              </div>

              <div className='text-xs text-gray-500'>
                {candidate.can_user.usr_birthdate
                  ? new Date(
                      candidate.can_user.usr_birthdate,
                    ).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </Link>
      ),
    },
    {
      key: 'msisdn',
      title: 'Điện thoại',
      sortField: 'can_user.usr_msisdn',
      visible: visibleColumns.msisdn,
      render: (candidate: ICandidateDetails) => (
        <div className='text-sm text-gray-900'>
          {candidate.can_user.usr_msisdn || 'N/A'}
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      sortField: 'can_user.usr_email',
      visible: visibleColumns.email,
      render: (candidate: ICandidateDetails) => (
        <div className='text-sm text-gray-900'>
          {candidate.can_user.usr_email || 'N/A'}
        </div>
      ),
    },
    {
      key: 'address',
      title: 'Địa chỉ',
      sortField: 'can_user.usr_address',
      visible: visibleColumns.address,
      render: (candidate: ICandidateDetails) => (
        <div className='text-sm text-gray-900 max-w-xs truncate'>
          {candidate.can_user.usr_address || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <Defer resolve={candidatesPromise}>
      {(response) => {
        const { data: candidates, pagination } = response;

        if (!candidates || candidates.length === 0) {
          // Empty State
          return (
            <div className='py-12 flex flex-col items-center justify-center'>
              <div className='bg-gray-100 rounded-full p-6 mb-4'>
                <span className='material-symbols-outlined text-5xl text-gray-400'>
                  person_off
                </span>
              </div>
              <h3 className='text-xl font-medium text-gray-800 mb-2'>
                Chưa có Ứng viên nào
              </h3>
              <p className='text-gray-500 mb-6 text-center max-w-md'>
                Thêm Ứng viên đầu tiên của bạn để bắt đầu quản lý thông tin của
                họ.
              </p>
              <Link
                to='/admin/candidates/new'
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-sm'>add</span>
                Thêm Ứng viên
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
                          selectedCandidates.length === candidates.length &&
                          candidates.length > 0
                        }
                        onChange={() => handleSelectAll(candidates)}
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
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <input
                          type='checkbox'
                          checked={selectedCandidates.some(
                            (item) => item.id === candidate.id,
                          )}
                          onChange={() => handleCandidateSelect(candidate)}
                          className='rounded text-blue-500'
                        />
                      </td>

                      {columns
                        .filter((column) => column.visible)
                        .map((column) => (
                          <td key={column.key as string} className='px-4 py-4'>
                            {column.render(candidate)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CandidatePagination pagination={pagination} />
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
