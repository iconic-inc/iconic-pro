import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Select from '~/widgets/Select';
import { action } from '../new';
import TextInput from '~/components/TextInput';
import PasswordInput from '~/components/PasswordInput';
import TextAreaInput from '~/components/TextAreaInput';

export default function CandidateCreateForm() {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastIdRef = useRef<any>(null);

  // Xử lý thông báo và chuyển hướng
  useEffect(() => {
    switch (fetcher.state) {
      case 'submitting':
        setIsSubmitting(true);
        toastIdRef.current = toast.loading('Loading...', {
          autoClose: false,
        });
        break;

      case 'idle':
        const actionData = fetcher.data;
        if (actionData?.success && actionData?.message) {
          toast.update(toastIdRef.current, {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            render: actionData.message,
            type: 'success',
            isLoading: false,
          });
          if (actionData.redirectTo) {
            navigate(actionData.redirectTo);
          }
        } else if (!actionData?.success) {
          toast.update(toastIdRef.current, {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            render: actionData?.message,
            type: 'error',
            isLoading: false,
          });
        }
        setIsSubmitting(false);
        break;
    }
  }, [fetcher.state]);

  // Xử lý khi hủy chỉnh sửa
  const handleCancel = () => {
    navigate(`/admin/candidates`);
  };

  return (
    <fetcher.Form
      method='POST'
      action='/admin/candidates/new'
      encType='multipart/form-data'
    >
      <div className='mx-auto overflow-hidden'>
        {/* Two column details */}
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow-sm p-6'>
            {/* Left Column - Candidate Info */}
            <div className='bg-white h-full border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
              <h2 className='text-lg font-medium text-gray-800 mb-4'>
                Thông tin Ứng viên
              </h2>

              <div className='space-y-4'>
                <TextInput
                  label='Họ'
                  id='lastName'
                  name='lastName'
                  type='text'
                  placeholder='Nhập họ Ứng viên'
                />

                <TextInput
                  label={
                    <span>
                      Tên <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='firstName'
                  name='firstName'
                  type='text'
                  placeholder='Nhập tên Ứng viên'
                  autoFocus
                  required
                />

                <TextInput
                  label='Ngày sinh'
                  id='birthdate'
                  name='birthdate'
                  type='date'
                  placeholder='Nhập ngày sinh'
                />

                <Select
                  label='Giới tính'
                  id='gender'
                  name='gender'
                  className='w-full'
                  defaultValue='male'
                >
                  <option value='male'>Nam</option>
                  <option value='female'>Nữ</option>
                  <option value='other'>Khác</option>
                </Select>
              </div>
            </div>

            {/* Top Right Column - Contact info */}
            <div className='bg-white border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
              <h2 className='text-lg font-medium text-gray-800 mb-4'>
                Thông tin liên hệ
              </h2>

              <div className='space-y-4'>
                <TextInput
                  label={
                    <span>
                      Số điện thoại <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='msisdn'
                  name='msisdn'
                  type='tel'
                  placeholder='Ví dụ: 0912345678'
                  required
                />

                <TextInput
                  label={
                    <span>
                      Email <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='email'
                  name='email'
                  type='email'
                  placeholder='example@gmail.com'
                  required
                />

                <TextInput
                  label='Địa chỉ'
                  id='address'
                  name='address'
                  type='text'
                  placeholder='Nhập địa chỉ đầy đủ'
                />
              </div>
            </div>

            {/* Bottom Left Column - CV and Summary */}
            <div className='bg-white border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
              <h2 className='text-lg font-medium text-gray-800 mb-4'>
                Thông tin hồ sơ
              </h2>

              <div className='space-y-4'>
                <TextInput
                  label='Kỹ năng'
                  id='skills'
                  name='skills'
                  type='text'
                  placeholder='Nhập kỹ năng'
                />

                <TextAreaInput
                  rows={3}
                  label='Kinh nghiệm làm việc'
                  id='experience'
                  name='experience'
                  type='text'
                  placeholder='Nhập kinh nghiệm làm việc'
                />

                <TextAreaInput
                  rows={3}
                  label='Tóm tắt'
                  id='summary'
                  name='summary'
                  type='text'
                  placeholder='Nhập tóm tắt'
                />
              </div>
            </div>

            {/* Bottom Right Column - Role and Password */}
            <div className='bg-white space-y-4 h-full border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
              <h2 className='text-lg font-medium text-gray-800'>
                Thông tin đăng nhập
              </h2>

              <TextInput
                label={
                  <span>
                    Tên đăng nhập <span className='text-red-500'>*</span>
                  </span>
                }
                id='username'
                name='username'
                type='text'
                placeholder='Nhập tên đăng nhập'
                required
              />

              <PasswordInput
                label={
                  <span>
                    Mật khẩu <span className='text-red-500'>*</span>
                  </span>
                }
                id='password'
                name='password'
                placeholder='Nhập mật khẩu'
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className='border-t border-gray-200 pt-4 px-6 sm:px-8 -mx-6 mt-8'>
        <div className='flex flex-wrap justify-end gap-3 max-w-6xl mx-auto'>
          <button
            type='button'
            onClick={handleCancel}
            className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition'
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type='reset'
            className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition'
            disabled={isSubmitting}
          >
            Đặt lại
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 transition flex items-center gap-2'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </fetcher.Form>
  );
}
