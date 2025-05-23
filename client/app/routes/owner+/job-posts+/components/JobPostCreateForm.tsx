import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Select from '~/widgets/Select';
import { action } from '../new';
import TextInput from '~/components/TextInput';
import TextAreaInput from '~/components/TextAreaInput';

export default function JobPostCreateForm() {
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
    navigate(`/owner/job-posts`);
  };

  return (
    <fetcher.Form
      method='POST'
      action='/owner/job-posts/new'
      encType='multipart/form-data'
    >
      <div className='mx-auto overflow-hidden'>
        {/* Two column details */}

        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow-sm p-6'>
            {/* Left Column - JobPostOwner Info */}
            <div className='bg-white h-full border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
              <div className='space-y-4'>
                <TextInput
                  label={
                    <span>
                      Tiêu đề <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='title'
                  name='title'
                  placeholder='Nhập tiêu đề công việc'
                  required
                />

                <div className='flex gap-4'>
                  <TextInput
                    label={
                      <span>
                        Lương từ <span className='text-red-500'>*</span>
                      </span>
                    }
                    id='salaryFrom'
                    name='salaryFrom'
                    placeholder='Nhập lương từ'
                    type='number'
                    step={100_000}
                    required
                  />

                  <TextInput
                    label={
                      <span>
                        Lương đến <span className='text-red-500'>*</span>
                      </span>
                    }
                    id='salaryTo'
                    name='salaryTo'
                    placeholder='Nhập lương đến'
                    type='number'
                    step={100_000}
                    required
                  />
                </div>

                <Select
                  label={
                    <span>
                      Hình thức <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='type'
                  name='type'
                  className='w-full'
                  required
                >
                  <option value='full-time'>Toàn thời gian</option>
                  <option value='part-time'>Bán thời gian</option>
                  <option value='intern'>Thực tập</option>
                </Select>

                <Select
                  label={
                    <span>
                      Trạng thái <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='status'
                  name='status'
                  className='w-full'
                  required
                >
                  <option value='active'>Đang hoạt động</option>
                  <option value='closed'>Ngừng hoạt động</option>
                </Select>
              </div>
            </div>

            {/* Top Right Column - Contact info */}
            <div className='bg-white border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
              <div className='space-y-4'>
                <TextAreaInput
                  label={
                    <span>
                      Yêu cầu <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='requirements'
                  name='requirements'
                  placeholder='Nhập yêu cầu công việc'
                  required
                  rows={4}
                />

                <TextAreaInput
                  label={
                    <span>
                      Mô tả <span className='text-red-500'>*</span>
                    </span>
                  }
                  id='description'
                  name='description'
                  placeholder='Nhập mô tả công việc'
                  required
                  rows={4}
                />
              </div>
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
