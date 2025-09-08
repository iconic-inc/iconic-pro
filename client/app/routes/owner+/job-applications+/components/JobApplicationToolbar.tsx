import { useSearchParams } from '@remix-run/react';
import { useState } from 'react';

export default function JobApplicationToolbar({
  visibleColumns,
  setVisibleColumns,
}: {
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: (value: Record<string, boolean>) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || '',
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  // Add a new handler for column visibility
  const handleColumnVisibilityChange = (columnKey: string) => {
    setVisibleColumns({
      ...visibleColumns,
      [columnKey]: !visibleColumns[columnKey],
    });
  };

  return (
    <div className='p-4 border-b border-gray-200 flex flex-col md:flex-row md:flex-wrap gap-3 items-start md:items-center justify-between'>
      {/* <form
        onSubmit={handleSearch}
        className='relative w-full md:flex-grow md:max-w-md'
      >
        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined'>
          search
        </span>
        <input
          type='text'
          placeholder='Tìm kiếm theo tên, điện thoại, email...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </form> */}
      <div></div>

      <div className='flex items-center gap-3 w-full md:w-auto mt-3 md:mt-0'>
        {/* Date Range Filter */}

        {/* Select attributes to display */}
        <details className='relative'>
          <summary className='px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition'>
            <span className='material-symbols-outlined text-sm'>
              view_column
            </span>
            <span>Cột</span>
          </summary>
          <div className='absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10'>
            <div className='p-3 space-y-2'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={visibleColumns.postTitle}
                  onChange={() => handleColumnVisibilityChange('postTitle')}
                  className='rounded text-blue-500'
                />
                <span>Tiêu đề công việc</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={visibleColumns.candidateName}
                  onChange={() => handleColumnVisibilityChange('candidateName')}
                  className='rounded text-blue-500'
                />
                <span>Tên ứng viên</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={visibleColumns.ownerName}
                  onChange={() => handleColumnVisibilityChange('ownerName')}
                  className='rounded text-blue-500'
                />
                <span>Tên chủ spa</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={visibleColumns.status}
                  onChange={() => handleColumnVisibilityChange('status')}
                  className='rounded text-blue-500'
                />
                <span>Trạng thái</span>
              </label>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
