import { Link, useSearchParams } from '@remix-run/react';
import { IReview } from '~/interfaces/review.interface';
import Defer from '~/components/Defer';
import ReviewPagination from './ReviewPagination';
import { IResponseList } from '~/interfaces/app.interface';

export default function ReviewList({
  reviewsPromise,
  selectedReviews,
  setSelectedReviews,
  visibleColumns,
}: {
  reviewsPromise: Promise<IResponseList<IReview>>;
  selectedReviews: IReview[];
  setSelectedReviews: (reviews: IReview[]) => void;
  visibleColumns: Record<string, boolean>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const handleSelectAll = (cases: IReview[]) => {
    if (selectedReviews.length === cases.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(cases);
    }
  };

  const handleReviewSelect = (review: IReview) => {
    if (selectedReviews.some((item) => item.id === review.id)) {
      setSelectedReviews(
        selectedReviews.filter((review) => review.id !== review.id),
      );
    } else {
      setSelectedReviews([...selectedReviews, review]);
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

  // Define table columns for the ReviewList component
  const columns = [
    {
      key: 'name',
      title: 'Tên review',
      sortField: 'sp_name',
      visible: visibleColumns.name,
      render: (review: IReview) => (
        <Link
          to={`/admin/reviews/${review.id}`}
          className='block w-full h-full hover:text-red-500'
        >
          {review.rv_author}
        </Link>
      ),
    },
  ];

  return (
    <Defer resolve={reviewsPromise}>
      {(response) => {
        const { data: reviews, pagination } = response;

        if (!reviews || reviews.length === 0) {
          // Empty State
          return (
            <div className='py-12 flex flex-col items-center justify-center'>
              <div className='bg-gray-100 rounded-full p-6 mb-4'>
                <span className='material-symbols-outlined text-5xl text-gray-400'>
                  person_off
                </span>
              </div>
              <h3 className='text-xl font-medium text-gray-800 mb-2'>
                Chưa có review nào
              </h3>
              <p className='text-gray-500 mb-6 text-center max-w-md'>
                Thêm review đầu tiên của bạn để bắt đầu quản lý thông tin của
                họ.
              </p>
              <Link
                to='/admin/reviews/new'
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-sm'>add</span>
                Thêm review
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
                          selectedReviews.length === reviews.length &&
                          reviews.length > 0
                        }
                        onChange={() => handleSelectAll(reviews)}
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
                  {reviews.map((review) => (
                    <tr key={review.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-4 whitereviewce-nowrap'>
                        <input
                          type='checkbox'
                          checked={selectedReviews.some(
                            (item) => item.id === review.id,
                          )}
                          onChange={() => handleReviewSelect(review)}
                          className='rounded text-blue-500'
                        />
                      </td>

                      {columns
                        .filter((column) => column.visible)
                        .map((column) => (
                          <td key={column.key as string} className='px-4 py-4'>
                            {column.render(review)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ReviewPagination pagination={pagination} />
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
