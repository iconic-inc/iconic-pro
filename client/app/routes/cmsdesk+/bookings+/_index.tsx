import { LoaderFunctionArgs, data } from '@remix-run/node';
import { Outlet, useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { parseAuthCookie } from '~/services/cookie.server';
import { getBookings } from '~/services/booking.server';
import HandsomeError from '~/components/HandsomeError';
import BookingList from '~/widgets/BookingList';
import { DatePicker } from '~/components/ui/date-picker';
import { SelectSearch } from '~/components/ui/SelectSearch';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const auth = await parseAuthCookie(request);
    if (!auth) {
      throw new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const query: Record<string, string> = {};

    // Extract query parameters
    const viewed = url.searchParams.get('viewed');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (viewed && viewed !== 'all') {
      query.viewed = viewed;
    }
    if (startDate) {
      query.startDate = startDate;
    }
    if (endDate) {
      query.endDate = endDate;
    }

    const bookings = await getBookings(auth, query);

    return {
      bookings,
    };
  } catch (error) {
    console.error('Error loading bookings:', error);
    if (error instanceof Response) {
      throw error;
    }
    return { bookings: [] };
  }
};

export default function BookingManager() {
  const { bookings } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedViewed, setSelectedViewed] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const viewedOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'true', label: 'Đã xem' },
    { value: 'false', label: 'Chưa xem' },
  ];

  const handleViewedChange = (value: string) => {
    setSelectedViewed(value);
    if (value === '' || value === 'all') {
      searchParams.delete('viewed');
    } else {
      searchParams.set('viewed', value);
    }
    setSearchParams(searchParams);
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    if (date) {
      searchParams.set('startDate', date.toISOString());
    } else {
      searchParams.delete('startDate');
    }
    setSearchParams(searchParams);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    if (date) {
      searchParams.set('endDate', date.toISOString());
    } else {
      searchParams.delete('endDate');
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedViewed('');
    setStartDate(undefined);
    setEndDate(undefined);
    searchParams.delete('viewed');
    searchParams.delete('startDate');
    searchParams.delete('endDate');
    setSearchParams(searchParams);
  };

  // Initialize state from URL params
  useEffect(() => {
    const viewed = searchParams.get('viewed') || '';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    setSelectedViewed(viewed);

    if (startDateParam) {
      setStartDate(new Date(startDateParam));
    }
    if (endDateParam) {
      setEndDate(new Date(endDateParam));
    }
  }, []);

  return (
    <div className='container grid-cols-1 gap-4'>
      {/* Filters */}
      <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
        <h3 className='text-lg font-semibold mb-4'>Bộ lọc</h3>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'>
          <div>
            <label className='block text-sm font-medium mb-2'>Trạng thái</label>
            <SelectSearch
              options={viewedOptions}
              value={selectedViewed}
              onValueChange={handleViewedChange}
              placeholder='Chọn trạng thái...'
              name='viewed'
              id='viewed'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Từ ngày</label>
            <DatePicker
              id='startDate'
              name='startDate'
              initialDate={startDate}
              onChange={handleStartDateChange}
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Đến ngày</label>
            <DatePicker
              id='endDate'
              name='endDate'
              initialDate={endDate}
              onChange={handleEndDateChange}
            />
          </div>

          <div>
            <Button
              variant='outline'
              onClick={handleClearFilters}
              className='w-full'
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Bookings table */}
      <div className='grid grid-cols-12 gap-4'>
        <BookingList bookings={bookings} />
        <Outlet />
      </div>
    </div>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
