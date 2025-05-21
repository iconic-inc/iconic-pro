import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Select from '~/widgets/Select';
import { action } from '../new';
import TextInput from '~/components/TextInput';
import TextAreaInput from '~/components/TextAreaInput';
import { IResponseList } from '~/interfaces/app.interface';
import { IjobPostDetails } from '~/interfaces/jobPost.interface';
import Defer from '~/components/Defer';

export default function JobPostCreateForm({
  ownersPromise,
}: {
  ownersPromise: Promise<IResponseList<IjobPostDetails>>;
}) {
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
    navigate(`/admin/job-posts`);
  };

  return (
    <fetcher.Form
      method='POST'
      action='/admin/job-posts/new'
      encType='multipart/form-data'
    >
      <div className='mx-auto overflow-hidden'>
        {/* Two column details */}
        <Defer resolve={ownersPromise}>
          {({ data: owners }) => (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow-sm p-6'>
                {/* Left Column - JobPostOwner Info */}
                <div className='bg-white h-full border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
                  <div className='space-y-4'>
                    <TextInput
                      label={
                        <span>
                          Tên jobPost <span className='text-red-500'>*</span>
                        </span>
                      }
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Nhập tên jobPost'
                      autoFocus
                      required
                    />

                    <TextAreaInput
                      label='Mô tả'
                      id='description'
                      name='description'
                      placeholder='Nhập mô tả ngắn về jobPost'
                      rows={3}
                    />

                    <TextInput
                      label={
                        <span>
                          Số điện thoại <span className='text-red-500'>*</span>
                        </span>
                      }
                      id='phone'
                      name='phone'
                      type='tel'
                      title='Số điện thoại không hợp lệ'
                      maxLength={12}
                      minLength={10}
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

                    <Select
                      label='Chọn chủ jobPost'
                      id='owner'
                      name='owner'
                      defaultValue={''}
                      className='w-full'
                      required
                    >
                      <option value='' disabled>
                        Chọn chủ jobPost
                      </option>
                      {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.spo_user.usr_firstName}{' '}
                          {owner.spo_user.usr_lastName}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Top Right Column - Contact info */}
                <div className='bg-white border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
                  <div className='space-y-4'>
                    <TextInput
                      label='Địa chỉ'
                      id='address'
                      name='address'
                      type='text'
                      placeholder='Nhập địa chỉ đầy đủ'
                    />

                    <TextInput
                      label='Website'
                      id='website'
                      name='website'
                      type='url'
                      placeholder='https://example.com'
                    />

                    <TextInput
                      label='Facebook'
                      id='facebook'
                      name='facebook'
                      type='url'
                      placeholder='https://facebook.com/example'
                    />
                    <TextInput
                      label='Instagram'
                      id='instagram'
                      name='instagram'
                      type='url'
                      placeholder='https://instagram.com/example'
                    />

                    <TextInput
                      label='Tiktok'
                      id='tiktok'
                      name='tiktok'
                      type='url'
                      placeholder='https://tiktok.com/@example'
                    />

                    <TextInput
                      label='Youtube'
                      id='youtube'
                      name='youtube'
                      type='url'
                      placeholder='https://youtube.com/@example'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Defer>
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
