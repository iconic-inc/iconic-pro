import { Link, useSearchParams } from '@remix-run/react';
import { IJobPost, IJobPostDetails } from '~/interfaces/jobPost.interface';
import Defer from '~/components/Defer';
import JobPostPagination from './JobPostPagination';
import { IResponseList } from '~/interfaces/app.interface';

export default function JobPostList({
  jobPostsPromise,
  selectedJobPosts,
  setSelectedJobPosts,
  visibleColumns,
}: {
  jobPostsPromise: Promise<IResponseList<IJobPostDetails>>;
  selectedJobPosts: IJobPostDetails[];
  setSelectedJobPosts: (jobPosts: IJobPostDetails[]) => void;
  visibleColumns: Record<string, boolean>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const handleSelectAll = (posts: IJobPostDetails[]) => {
    if (selectedJobPosts.length === posts.length) {
      setSelectedJobPosts([]);
    } else {
      setSelectedJobPosts(posts);
    }
  };

  const handleJobPostSelect = (jobPost: IJobPostDetails) => {
    if (selectedJobPosts.some((item) => item.id === jobPost.id)) {
      setSelectedJobPosts(
        selectedJobPosts.filter((jobPost) => jobPost.id !== jobPost.id),
      );
    } else {
      setSelectedJobPosts([...selectedJobPosts, jobPost]);
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

  // Define table columns for the JobPostList component
  const columns = [
    {
      key: 'title',
      title: 'Tiêu đề',
      sortField: 'jpo_title',
      visible: visibleColumns.title,
      render: (jobPost: IJobPostDetails) => (
        <Link
          to={`/owner/job-posts/${jobPost.id}`}
          className='block w-full h-full hover:text-red-500'
        >
          {jobPost.jpo_title}
        </Link>
      ),
    },
    {
      key: 'ownerName',
      title: 'Tên người đăng',
      sortField: 'jpo_owner.spo_user.usr_fistName',
      visible: visibleColumns.ownerName,
      render: (jobPost: IJobPostDetails) => (
        <div className='flex items-center'>
          <span>{`${jobPost.jpo_owner.spo_user.usr_firstName} ${jobPost.jpo_owner.spo_user.usr_lastName}`}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      sortField: 'createdAt',
      visible: visibleColumns.createdAt,
      render: (jobPost: IJobPostDetails) => (
        <div className='flex items-center'>
          <span>
            {new Date(jobPost.createdAt).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      title: 'Cập nhật lúc',
      sortField: 'updatedAt',
      visible: visibleColumns.updatedAt,
      render: (jobPost: IJobPostDetails) => (
        <div className='flex items-center'>
          <span>
            {new Date(jobPost.updatedAt).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Defer resolve={jobPostsPromise}>
      {(response) => {
        const { data: jobPosts, pagination } = response;

        if (!jobPosts || jobPosts.length === 0) {
          // Empty State
          return (
            <div className='py-12 flex flex-col items-center justify-center'>
              <div className='bg-gray-100 rounded-full p-6 mb-4'>
                <span className='material-symbols-outlined text-5xl text-gray-400'>
                  person_off
                </span>
              </div>
              <h3 className='text-xl font-medium text-gray-800 mb-2'>
                Chưa có Tin tuyển dụng nào
              </h3>
              <p className='text-gray-500 mb-6 text-center max-w-md'>
                Thêm Tin tuyển dụng đầu tiên của bạn để bắt đầu quản lý thông
                tin.
              </p>
              <Link
                to='/owner/job-posts/new'
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-sm'>add</span>
                Thêm Tin tuyển dụng
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
                          selectedJobPosts.length === jobPosts.length &&
                          jobPosts.length > 0
                        }
                        onChange={() => handleSelectAll(jobPosts)}
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
                  {jobPosts.map((jpo) => (
                    <tr key={jpo.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <input
                          type='checkbox'
                          checked={selectedJobPosts.some(
                            (item) => item.id === jpo.id,
                          )}
                          onChange={() => handleJobPostSelect(jpo)}
                          className='rounded text-blue-500'
                        />
                      </td>

                      {columns
                        .filter((column) => column.visible)
                        .map((column) => (
                          <td key={column.key as string} className='px-4 py-4'>
                            {column.render(jpo)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <JobPostPagination pagination={pagination} />
          </>
        );
      }}
    </Defer>
  );
}
