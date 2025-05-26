import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';

import { getJobPostById } from '~/services/jobPost.server';
import CustomButton from '~/widgets/CustomButton';
import DashContentHeader from '~/components/DashContentHeader';
import { formatCurrency } from '~/utils';
import { parseAuthCookie } from '~/services/cookie.server';

// Loader function to fetch data from API
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // Xác thực người dùng trước khi tiếp tục
  const auth = await parseAuthCookie(request);
  if (!auth) {
    return redirect('/admin/login');
  }

  try {
    // Lấy ID jobPost từ URL
    const { id } = params;
    if (!id) {
      // Nếu không có ID, chuyển hướng về trang danh sách jobPost
      return redirect('/admin/job-posts');
    }

    // Gọi song song các API để tăng tốc độ
    const jobPost = await getJobPostById(id, auth);
    // Trả về dữ liệu để component sử dụng với cache headers
    return {
      jobPost,
    };
  } catch (error) {
    console.error('Error loading jobPost data:', error);
    // Xử lý lỗi và trả về thông báo lỗi
    return {
      jobPost: null,
      error:
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi tải dữ liệu jobPost',
    };
  }
};

export default function EmpJobPostDetail() {
  // Lấy dữ liệu từ loader
  const { jobPost, error } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Kiểm tra nếu có lỗi hoặc không có dữ liệu jobPost
  if (error || !jobPost) {
    return (
      <>
        {/* <ContentHeader title='Chi Tiết jobPost' /> */}
        <div className='mx-auto bg-white rounded-lg shadow-sm p-6'>
          <div className='text-center text-red-500 mb-4'>
            {error || 'Không tìm thấy thông tin jobPost'}
          </div>
          <div className='flex justify-center'>
            <Link
              to='/admin/job-posts'
              className='px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 transition'
            >
              Quay Lại Danh Sách
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { jpo_owner: owner } = jobPost;
  console.log(jobPost);

  return (
    <>
      <DashContentHeader
        title='Chi Tiết Tin Tuyển Dụng'
        // actionContent='Thêm Mới'
        // actionHandler={() => navigate(`/admin/job-posts/new`)}
      />

      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Header - Hiển thị tên và tiến độ */}
        <div className='p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center gap-3'>
            {/* Hiển thị tên jobPost */}
            <span className='font-semibold text-2xl text-gray-800'>
              {`${jobPost.jpo_title}` || 'N/A'}
            </span>
            {/* Hiển thị ID jobPost */}
            <span className='text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-md'>
              #{jobPost.id?.substring(0, 8) || 'N/A'}
            </span>
          </div>

          <CustomButton
            tagType='link'
            href={`/admin/job-posts/${jobPost.id}/edit`}
            color='blue'
          >
            Chỉnh Sửa
          </CustomButton>
        </div>

        {/* Nội dung - Hiển thị thông tin chi tiết */}
        <div className='p-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
            {/* Left Column - JobPost Info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Tiêu đề
                </span>
                <span className='text-gray-700'>
                  {`${jobPost.jpo_title}` || 'N/A'}
                </span>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Lương từ
                </span>
                <span className='text-gray-700'>
                  {`${formatCurrency(jobPost.jpo_salaryFrom || 0)} - ${formatCurrency(jobPost.jpo_salaryTo || 0)}`}
                </span>
              </div>

              <div className='flex gap-4'>
                <div className='flex flex-col bg-gray-50 p-3 rounded-md w-1/2'>
                  <span className='text-sm text-gray-500 font-medium'>
                    Trạng thái
                  </span>
                  <span className='text-gray-700'>
                    {jobPost.jpo_status === 'active'
                      ? 'Đang hoạt động'
                      : 'Ngừng hoạt động'}
                  </span>
                </div>

                <div className='flex flex-col bg-gray-50 p-3 rounded-md w-1/2'>
                  <span className='text-sm text-gray-500 font-medium'>
                    Hình thức
                  </span>
                  <span className='text-gray-700'>
                    {jobPost.jpo_type === 'part-time'
                      ? 'Bán thời gian'
                      : jobPost.jpo_type === 'intern'
                        ? 'Thực tập'
                        : 'Toàn thời gian'}
                  </span>
                </div>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Yêu cầu
                </span>
                <p className='text-gray-700'>
                  {jobPost.jpo_requirements || 'Không có yêu cầu'}
                </p>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Mô tả</span>
                <p className='text-gray-700'>
                  {jobPost.jpo_description || 'Không có mô tả'}
                </p>
              </div>
            </div>

            {/* Right Column - Case Info */}
            <div className='space-y-5 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition'>
              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Tên Người đăng
                </span>
                <p className='text-gray-700'>
                  {`${owner.spo_user.usr_firstName} ${owner.spo_user.usr_lastName}` ||
                    'N/A'}
                </p>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>Email</span>
                <p className='text-gray-700'>
                  {owner.spo_user.usr_email || 'N/A'}
                </p>
              </div>

              <div className='flex flex-col bg-gray-50 p-3 rounded-md'>
                <span className='text-sm text-gray-500 font-medium'>
                  Số điện thoại
                </span>
                <p className='text-gray-700'>
                  {owner.spo_user.usr_msisdn || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
