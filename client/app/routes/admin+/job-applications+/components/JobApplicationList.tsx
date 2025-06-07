import { Link, useSearchParams } from '@remix-run/react';
import { IJobApplicationDetails } from '~/interfaces/jobApplication.interface';
import Defer from '~/components/Defer';
import JobApplicationPagination from './JobApplicationPagination';
import { IResponseList } from '~/interfaces/app.interface';
import { IUser } from '~/interfaces/user.interface';

export default function JobApplicationList({
  jobAppsPromise,
  selectedJobApplications,
  setSelectedJobApplications,
  visibleColumns,
}: {
  jobAppsPromise: Promise<IResponseList<IJobApplicationDetails>>;
  selectedJobApplications: IJobApplicationDetails[];
  setSelectedJobApplications: (jobApps: IJobApplicationDetails[]) => void;
  visibleColumns: Record<string, boolean>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const handleSelectAll = (cases: IJobApplicationDetails[]) => {
    if (selectedJobApplications.length === cases.length) {
      setSelectedJobApplications([]);
    } else {
      setSelectedJobApplications(cases);
    }
  };

  const handleJobApplicationSelect = (jobApp: IJobApplicationDetails) => {
    if (selectedJobApplications.some((item) => item.id === jobApp.id)) {
      setSelectedJobApplications(
        selectedJobApplications.filter((jobApp) => jobApp.id !== jobApp.id),
      );
    } else {
      setSelectedJobApplications([...selectedJobApplications, jobApp]);
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

  // Define table columns for the JobApplicationList component
  const columns = [
    {
      key: 'postTitle',
      title: 'Tiêu đề công việc',
      sortField: 'jap_jobPost.jpo_title',
      visible: visibleColumns.postTitle,
      render: (jobApp: IJobApplicationDetails) => (
        <Link
          to={`/admin/job-applications/${jobApp.id}`}
          className='text-gray-900 hover:text-red-500'
        >
          {jobApp.jap_jobPost?.jpo_title || 'N/A'}
        </Link>
      ),
    },
    {
      key: 'candidateName',
      title: 'Tên ứng viên',
      sortField: 'jap_candidate.can_user.usr_firstName',
      visible: visibleColumns.candidateName,
      render: (jobApp: IJobApplicationDetails) => (
        <div className='text-sm text-gray-900'>
          {`${jobApp.jap_candidate.can_user.usr_firstName} ${jobApp.jap_candidate.can_user.usr_lastName}`}
        </div>
      ),
    },
    {
      key: 'ownerName',
      title: 'Tên chủ spa',
      sortField: 'jap_postPost.jpo_owner.spo_user.usr_firstName',
      visible: visibleColumns.ownerName,
      render: (jobApp: IJobApplicationDetails) => (
        <div className='text-sm text-gray-900'>
          {`${jobApp.jap_jobPost?.jpo_owner.spo_user.usr_firstName} ${jobApp.jap_jobPost?.jpo_owner.spo_user.usr_lastName}`}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      sortField: 'jap_status',
      visible: visibleColumns.status,
      render: (jobApp: IJobApplicationDetails) => (
        <div className='text-sm text-gray-900 max-w-xs truncate'>
          {jobApp.jap_status}
        </div>
      ),
    },
  ];

  return (
    <Defer resolve={jobAppsPromise}>
      {(response) => {
        const { data: jobApps, pagination } = response;

        if (!jobApps || jobApps.length === 0) {
          // Empty State
          return (
            <div className='py-12 flex flex-col items-center justify-center'>
              <div className='bg-gray-100 rounded-full p-6 mb-4'>
                <span className='material-symbols-outlined text-5xl text-gray-400'>
                  person_off
                </span>
              </div>
              <h3 className='text-xl font-medium text-gray-800 mb-2'>
                Chưa có Đơn ứng tuyển nào
              </h3>
              <p className='text-gray-500 mb-6 text-center max-w-md'>
                Thêm Đơn ứng tuyển đầu tiên của bạn để bắt đầu quản lý thông tin
                của họ.
              </p>
              <Link
                to='/admin/job-applications/new'
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-sm'>add</span>
                Thêm Đơn ứng tuyển
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
                          selectedJobApplications.length === jobApps.length &&
                          jobApps.length > 0
                        }
                        onChange={() => handleSelectAll(jobApps)}
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
                  {jobApps.map((jobApp) => (
                    <tr key={jobApp.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <input
                          type='checkbox'
                          checked={selectedJobApplications.some(
                            (item) => item.id === jobApp.id,
                          )}
                          onChange={() => handleJobApplicationSelect(jobApp)}
                          className='rounded text-blue-500'
                        />
                      </td>

                      {columns
                        .filter((column) => column.visible)
                        .map((column) => (
                          <td key={column.key as string} className='px-4 py-4'>
                            {column.render(jobApp)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <JobApplicationPagination pagination={pagination} />
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
