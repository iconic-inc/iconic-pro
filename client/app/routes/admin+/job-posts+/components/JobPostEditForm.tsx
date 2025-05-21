import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import TextInput from '~/components/TextInput';
import { IJobPost, IJobPostDetails } from '~/interfaces/jobPost.interface';
import Select from '~/widgets/Select';
import { action } from '../$id_.edit';
import CustomButton from '~/widgets/CustomButton';
import { IResponseList } from '~/interfaces/app.interface';
import TextAreaInput from '~/components/TextAreaInput';

export default function JobPostEditForm({
  jobPost,
  ownersPromise,
}: {
  jobPost: IJobPostDetails;
  ownersPromise: Promise<IResponseList<IJobPostDetails>>;
}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetcher = useFetcher<typeof action>();
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
          // if (actionData.redirectTo) {
          //   navigate(actionData.redirectTo);
          // }
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
    navigate(`/admin/job-posts/${jobPost.id}`);
  };

  return (
    <fetcher.Form method='PUT'>
      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
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
                  defaultValue={jobPost.jpo_title}
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
                    defaultValue={jobPost.jpo_salaryFrom}
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
                    defaultValue={jobPost.jpo_salaryTo}
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
                  defaultValue={jobPost.jpo_type}
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
                  defaultValue={jobPost.jpo_status}
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
                  defaultValue={jobPost.jpo_requirements}
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
                  defaultValue={jobPost.jpo_description}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className='flex justify-between border-t border-gray-200 pt-4 px-6 sm:px-8 -mx-6 mt-8'>
        <CustomButton type='button' color='gray' onClick={handleCancel}>
          Quay lại
        </CustomButton>

        <div className='flex flex-wrap justify-end gap-3 max-w-6xl'>
          <CustomButton
            type='button'
            onClick={handleCancel}
            color='red'
            disabled={isSubmitting}
          >
            Hủy
          </CustomButton>
          <CustomButton
            type='reset'
            color='transparent'
            disabled={isSubmitting}
          >
            Đặt lại
          </CustomButton>
          <CustomButton type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </CustomButton>
        </div>
      </div>
    </fetcher.Form>
  );
}
