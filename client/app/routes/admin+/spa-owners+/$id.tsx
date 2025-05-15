import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { getSpaOwnerById4Admin } from '~/services/spaOwner.server';
import { formatDate, calculateAge } from '~/utils';
import CustomButton from '~/widgets/CustomButton';
import DashContentHeader from '~/components/DashContentHeader';

// Loader function to fetch data from API
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // Xác thực người dùng trước khi tiếp tục
  const auth = await isAuthenticated(request);
  if (!auth) {
    return redirect('/admin/login');
  }

  try {
    // Lấy ID chủ spa từ URL
    const { id } = params;
    if (!id) {
      // Nếu không có ID, chuyển hướng về trang danh sách chủ spa
      return redirect('/admin/spa-owners');
    }

    // Gọi song song các API để tăng tốc độ
    const spaOwner = await getSpaOwnerById4Admin(id, auth);
    // Trả về dữ liệu để component sử dụng với cache headers
    return {
      spaOwner,
    };
  } catch (error) {
    console.error('Error loading spaOwner data:', error);
    // Xử lý lỗi và trả về thông báo lỗi
    return {
      spaOwner: null,
      error:
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi tải dữ liệu chủ spa',
    };
  }
};

// Hàm định dạng ngày sinh và tính tuổi
const formatDateAndAge = (dateString?: string) => {
  if (!dateString) return 'N/A';

  const formattedDate = formatDate(dateString, 'DD/MM/YYYY');
  const age = calculateAge(new Date(dateString));

  return `${formattedDate} (${age} tuổi)`;
};

export default function EmpSpaOwnerDetail() {
  // Lấy dữ liệu từ loader
  const { spaOwner, error } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Kiểm tra nếu có lỗi hoặc không có dữ liệu chủ spa
  if (error || !spaOwner) {
    return (
      <>
        {/* <ContentHeader title='Chi Tiết chủ spa' /> */}
        <div className='mx-auto bg-white rounded-lg shadow-sm p-6'>
          <div className='text-center text-red-500 mb-4'>
            {error || 'Không tìm thấy thông tin chủ spa'}
          </div>
          <div className='flex justify-center'>
            <Link
              to='/admin/spa-owners'
              className='px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 transition'
            >
              Quay Lại Danh Sách
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { spo_user: user } = spaOwner;

  return (
    <>
      <DashContentHeader
        title='Chi Tiết chủ spa'
        actionContent='Thêm Chủ Spa'
        actionHandler={() => navigate(`/admin/spa-owners/new`)}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Header - Hiển thị tên và tiến độ */}
        <div className='p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center gap-3'>
            {/* Hiển thị tên chủ spa */}
            <div className='font-semibold text-2xl text-gray-800'>
              {`${user.usr_firstName} ${user.usr_lastName}` || 'N/A'}
            </div>
            {/* Hiển thị ID chủ spa */}
            <div className='text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-md'>
              #{spaOwner.id?.substring(0, 8) || 'N/A'}
            </div>
          </div>

          <CustomButton
            tagType='link'
            href={`/admin/spa-owners/${spaOwner.id}/edit`}
            color='blue'
          >
            Chỉnh Sửa
          </CustomButton>
        </div>

        {/* Nội dung - Hiển thị thông tin chi tiết */}
        <div className='p-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
            {/* Left Column - SpaOwner Info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <h2 className='text-lg font-medium text-gray-800 border-b border-gray-100 pb-2'>
                Thông tin chủ spa
              </h2>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Ngày sinh
                </span>
                <span className='text-gray-700'>
                  {formatDateAndAge(user.usr_birthdate)}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Giới tính
                </span>
                <span className='text-gray-700'>
                  {user.usr_sex === 'male'
                    ? 'Nam'
                    : user.usr_sex === 'female'
                      ? 'Nữ'
                      : user.usr_sex === 'other'
                        ? 'Khác'
                        : 'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Tên đăng nhập
                </span>
                <span className='text-gray-700'>{user.usr_username}</span>
              </div>
            </div>

            {/* Right Column - Case Info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <h2 className='text-lg font-medium text-gray-800 border-b border-gray-100 pb-2'>
                Thông tin liên hệ
              </h2>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Số điện thoại
                </span>
                <a
                  href={`tel:${user?.usr_msisdn}`}
                  className='text-blue-500 hover:text-blue-600 transition'
                >
                  {user.usr_msisdn || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Email</span>
                <a
                  href={`mailto:${user.usr_email}`}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                >
                  {user.usr_email || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md md:col-span-2'>
                <span className='text-sm text-gray-500 font-medium'>
                  Địa chỉ
                </span>
                <span className='text-gray-700'>
                  {user.usr_address || 'Không có địa chỉ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
