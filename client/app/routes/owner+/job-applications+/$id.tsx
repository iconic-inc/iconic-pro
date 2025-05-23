import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { getMyJobApplicationById } from '~/services/jobApplication.server';
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
    // Lấy ID Đơn ứng tuyển từ URL
    const { id } = params;
    if (!id) {
      // Nếu không có ID, chuyển hướng về trang danh sách Đơn ứng tuyển
      return redirect('/owner/job-applications');
    }

    // Gọi song song các API để tăng tốc độ
    const jobApp = await getMyJobApplicationById(id, auth);
    // Trả về dữ liệu để component sử dụng với cache headers
    return {
      jobApp,
    };
  } catch (error) {
    console.error('Error loading jobApp data:', error);
    // Xử lý lỗi và trả về thông báo lỗi
    return {
      jobApp: null,
      error:
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi tải dữ liệu Đơn ứng tuyển',
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

export default function EmpJobApplicationDetail() {
  // Lấy dữ liệu từ loader
  const { jobApp, error } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Kiểm tra nếu có lỗi hoặc không có dữ liệu Đơn ứng tuyển
  if (error || !jobApp) {
    return (
      <>
        {/* <ContentHeader title='Chi Tiết Đơn ứng tuyển' /> */}
        <div className='mx-auto bg-white rounded-lg shadow-sm p-6'>
          <div className='text-center text-red-500 mb-4'>
            {error || 'Không tìm thấy thông tin Đơn ứng tuyển'}
          </div>
          <div className='flex justify-center'>
            <Link
              to='/owner/job-applications'
              className='px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 transition'
            >
              Quay Lại Danh Sách
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { jap_candidate: candidate, jap_jobPost: jobPost } = jobApp;
  console.log(jobApp);

  return (
    <>
      <DashContentHeader title='Chi Tiết Đơn ứng tuyển' />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Nội dung - Hiển thị thông tin chi tiết */}
        <div className='p-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
            {/* Left Column - JobApplication Info */}
            <div className='space-y-5 row-span-2 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <h2 className='text-lg font-medium text-gray-800 border-b border-gray-100 pb-2'>
                Thông tin Tin tuyển dụng
              </h2>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Tiêu đề
                </span>
                <span className='text-gray-700'>
                  {jobPost.jpo_title || 'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Mô tả</span>
                <span className='text-gray-700'>
                  {jobPost.jpo_description || 'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Yêu cầu
                </span>
                <span className='text-gray-700'>
                  {jobPost.jpo_requirements || 'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Lương</span>
                <span className='text-gray-700'>
                  {jobPost.jpo_salaryFrom} - {jobPost.jpo_salaryTo}{' '}
                  {jobPost.jpo_currency}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Trạng thái
                </span>
                <span className='text-gray-700'>
                  {jobPost.jpo_status === 'active'
                    ? 'Đang hoạt động'
                    : jobPost.jpo_status === 'closed'
                      ? 'Ngừng hoạt động'
                      : 'N/A'}
                </span>
              </div>
            </div>

            {/* Right Column - candidate Info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <h2 className='text-lg font-medium text-gray-800 border-b border-gray-100 pb-2'>
                Thông tin ứng viên
              </h2>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Họ tên
                </span>
                <span className='text-gray-700'>
                  {`${candidate.can_user.usr_firstName} ${candidate.can_user.usr_lastName}` ||
                    'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Số điện thoại
                </span>
                <a
                  href={`tel:${candidate.can_user?.usr_msisdn}`}
                  className='text-blue-500 hover:text-blue-600 transition'
                >
                  {candidate.can_user.usr_msisdn || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Email</span>
                <a
                  href={`mailto:${candidate.can_user.usr_email}`}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                >
                  {candidate.can_user.usr_email || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md md:col-span-2'>
                <span className='text-sm text-gray-500 font-medium'>
                  Địa chỉ
                </span>
                <span className='text-gray-700'>
                  {candidate.can_user.usr_address || 'Không có địa chỉ'}
                </span>
              </div>
            </div>

            {/* Right Column - Spa owner info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <h2 className='text-lg font-medium text-gray-800 border-b border-gray-100 pb-2'>
                Thông tin Chủ spa
              </h2>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Họ tên
                </span>
                <span className='text-gray-700'>
                  {`${jobPost.jpo_owner.spo_user.usr_firstName} ${jobPost.jpo_owner.spo_user.usr_lastName}` ||
                    'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Số điện thoại
                </span>
                <a
                  href={`tel:${jobPost.jpo_owner.spo_user?.usr_msisdn}`}
                  className='text-blue-500 hover:text-blue-600 transition'
                >
                  {jobPost.jpo_owner.spo_user.usr_msisdn || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Email</span>
                <a
                  href={`mailto:${jobPost.jpo_owner.spo_user.usr_email}`}
                  className='text-blue-500 hover:text-blue-600 transition break-all'
                >
                  {jobPost.jpo_owner.spo_user.usr_email || 'N/A'}
                </a>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md md:col-span-2'>
                <span className='text-sm text-gray-500 font-medium'>
                  Địa chỉ
                </span>
                <span className='text-gray-700'>
                  {jobPost.jpo_owner.spo_user.usr_address || 'Không có địa chỉ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
