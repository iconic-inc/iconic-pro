import { Link, useNavigate, useNavigation } from '@remix-run/react';
import { format, formatDate } from 'date-fns';
import { useEffect, useState } from 'react';
import LoadingOverlay from '~/components/LoadingOverlay';
import { COURSE_LEVELS, COURSES } from '~/constants/courses.constant';
import { IBooking } from '~/interfaces/booking.interface';

export default function BookingList({
  bookings,
}: {
  bookings: Array<IBooking>;
}) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    switch (navigation.state) {
      case 'loading':
        setLoading(true);
        break;
      default:
        setLoading(false);
        break;
    }
  }, [navigation.state]);

  return (
    <>
      <table className='table-auto col-span-12'>
        <thead className=''>
          <tr className=''>
            <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
              Tên
            </th>

            <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
              Số điện thoại
            </th>

            <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
              Tên Khóa Học
            </th>

            <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
              Cấp độ Khóa Học
            </th>

            <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
              Thời gian đăng ký
            </th>

            <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
              Trạng thái
            </th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((bok, i) => (
            <tr
              key={i}
              className='bg-white lg:hover:bg-zinc-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0'
            >
              <td className='w-full lg:w-auto text-center border border-b block lg:table-cell relative lg:static hover:underline hover:text-[--sub5-text] hover:cursor-pointer'>
                <Link
                  to={`/cmsdesk/bookings/${bok.id}`}
                  className='block p-3 w-full h-full'
                >
                  <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                    Tên
                  </span>
                  {bok.bok_name}
                </Link>
              </td>

              <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
                <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                  Số điện thoại
                </span>
                {bok.bok_msisdn}
              </td>

              <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
                <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                  Tên Khóa Học
                </span>
                {COURSES.find((course) => course.value === bok.bok_courseName)
                  ?.label || 'Không xác định'}
              </td>

              <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
                <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                  Cấp độ Khóa Học
                </span>
                {COURSE_LEVELS.find(
                  (level) => level.value === bok.bok_courseLevel,
                )?.label || 'Không xác định'}
              </td>

              <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
                <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                  Thời gian đăng ký
                </span>
                {formatDate(bok.createdAt, 'HH:mm - dd/MM/yyyy')}
              </td>

              <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
                <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                  Trạng thái
                </span>
                {bok.bok_viewed ? (
                  <p className='m-auto w-fit bg-green-500 rounded px-2 py-1 text-xs font-bold text-white'>
                    Đã xem
                  </p>
                ) : (
                  <p className='m-auto w-fit rounded bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                    Chưa xem
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <LoadingOverlay />}
    </>
  );
}
