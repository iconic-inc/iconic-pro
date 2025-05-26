import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';

import { getSpaById4Admin } from '~/services/spa.server';
import CustomButton from '~/widgets/CustomButton';
import DashContentHeader from '~/components/DashContentHeader';
import { parseAuthCookie } from '~/services/cookie.server';

// Loader function to fetch data from API
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // Xác thực người dùng trước khi tiếp tục
  const auth = await parseAuthCookie(request);
  if (!auth) {
    return redirect('/admin/login');
  }

  try {
    // Lấy ID spa từ URL
    const { id } = params;
    if (!id) {
      // Nếu không có ID, chuyển hướng về trang danh sách spa
      return redirect('/admin/spas');
    }

    // Gọi song song các API để tăng tốc độ
    const spa = await getSpaById4Admin(id, auth);
    // Trả về dữ liệu để component sử dụng với cache headers
    return {
      spa,
    };
  } catch (error) {
    console.error('Error loading spa data:', error);
    // Xử lý lỗi và trả về thông báo lỗi
    return {
      spa: null,
      error:
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi tải dữ liệu spa',
    };
  }
};

export default function EmpSpaDetail() {
  // Lấy dữ liệu từ loader
  const { spa, error } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Kiểm tra nếu có lỗi hoặc không có dữ liệu spa
  if (error || !spa) {
    return (
      <>
        {/* <ContentHeader title='Chi Tiết spa' /> */}
        <div className='mx-auto bg-white rounded-lg shadow-sm p-6'>
          <div className='text-center text-red-500 mb-4'>
            {error || 'Không tìm thấy thông tin spa'}
          </div>
          <div className='flex justify-center'>
            <Link
              to='/admin/spas'
              className='px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 transition'
            >
              Quay Lại Danh Sách
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { sp_owner: owner, sp_socialLinks } = spa;

  return (
    <>
      <DashContentHeader
        title='Chi Tiết spa'
        actionContent='Thêm spa'
        actionHandler={() => navigate(`/admin/spas/new`)}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Header - Hiển thị tên và tiến độ */}
        <div className='p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center gap-3'>
            {/* Hiển thị tên spa */}
            <span className='font-semibold text-2xl text-gray-800'>
              Spa {`${spa.sp_name}` || 'N/A'}
            </span>
            {/* Hiển thị ID spa */}
            <span className='text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-md'>
              #{spa.id?.substring(0, 8) || 'N/A'}
            </span>
          </div>

          <CustomButton
            tagType='link'
            href={`/admin/spas/${spa.id}/edit`}
            color='blue'
          >
            Chỉnh Sửa
          </CustomButton>
        </div>

        {/* Nội dung - Hiển thị thông tin chi tiết */}
        <div className='p-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
            {/* Left Column - Spa Info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Chủ spa
                </span>
                <span className='text-gray-700'>
                  {`${owner.spo_user.usr_firstName} ${owner.spo_user.usr_lastName}` ||
                    'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Số điện thoại
                </span>
                <a
                  href={`tel:${spa?.sp_phone}`}
                  className='text-blue-500 hover:text-blue-600 transition'
                >
                  {spa.sp_phone || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Email</span>
                <a
                  href={`mailto:${spa.sp_email}`}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                >
                  {spa.sp_email || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md md:col-span-2'>
                <span className='text-sm text-gray-500 font-medium'>
                  Địa chỉ
                </span>
                <span className='text-gray-700'>
                  {spa.sp_address.formattedAddress || 'Không có địa chỉ'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Mô tả</span>
                <p className='text-gray-700'>
                  {spa.sp_description || 'Không có mô tả'}
                </p>
              </div>
            </div>

            {/* Right Column - Case Info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Website
                </span>
                <a
                  href={spa.sp_website}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {spa.sp_website || 'Không có website'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Facebook
                </span>
                <a
                  href={sp_socialLinks?.facebook}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {sp_socialLinks?.facebook || 'Không có Facebook'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Instagram
                </span>
                <a
                  href={sp_socialLinks?.instagram}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {sp_socialLinks?.instagram || 'Không có Instagram'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Tiktok
                </span>
                <a
                  href={sp_socialLinks?.tiktok}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {sp_socialLinks?.tiktok || 'Không có Tiktok'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Youtube
                </span>
                <a
                  href={sp_socialLinks?.youtube}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {sp_socialLinks?.youtube || 'Không có Youtube'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
