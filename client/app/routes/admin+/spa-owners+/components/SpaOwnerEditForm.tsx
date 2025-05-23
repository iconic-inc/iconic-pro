import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import TextInput from '~/components/TextInput';
import { ISpaOwner, ISpaOwnerDetails } from '~/interfaces/spaOwner.interface';
import Select from '~/widgets/Select';
import { action } from '../$id_.edit';
import PasswordInput from '~/components/PasswordInput';
import CustomButton from '~/widgets/CustomButton';

export default function SpaOwnerEditForm({
  spaOwner,
}: {
  spaOwner: ISpaOwnerDetails;
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
    navigate(`/admin/spa-owners/${spaOwner.id}`);
  };

  const { spo_user: user } = spaOwner;
  return (
    <fetcher.Form method='PUT'>
      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Two column details */}
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow-sm p-6'>
            {/* Left Column - SpaOwner Info */}
            <div className='bg-white row-span-2 h-full border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
              <h2 className='text-lg font-medium text-gray-800 mb-4'>
                Thông tin chủ spa
              </h2>

              <div className='space-y-4'>
                <TextInput
                  label='Họ'
                  id='lastName'
                  name='lastName'
                  type='text'
                  placeholder='Nhập họ chủ spa'
                  defaultValue={user.usr_lastName}
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
                  placeholder='Nhập tên chủ spa'
                  autoFocus
                  required
                  defaultValue={user.usr_firstName}
                />

                <TextInput
                  label='Ngày sinh'
                  id='birthdate'
                  name='birthdate'
                  type='date'
                  placeholder='Nhập ngày sinh'
                  defaultValue={
                    user.usr_birthdate
                      ? new Date(user.usr_birthdate).toISOString().split('T')[0]
                      : ''
                  }
                />

                <Select
                  label='Giới tính'
                  id='gender'
                  name='gender'
                  className='w-full'
                  defaultValue={user.usr_sex}
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
                  defaultValue={user.usr_msisdn}
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
                  defaultValue={user.usr_email}
                />

                <TextInput
                  label='Địa chỉ'
                  id='address'
                  name='address'
                  type='text'
                  defaultValue={user.usr_address}
                  placeholder='Nhập địa chỉ đầy đủ'
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
                defaultValue={user.usr_username}
              />

              <PasswordInput
                label={<span>Mật khẩu</span>}
                id='password'
                name='password'
                placeholder='Nhập mật khẩu (để trống nếu không thay đổi)'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className='flex justify-between border-t border-gray-200 pt-4 px-6 sm:px-8 -mx-6 mt-8'>
        <CustomButton type='button' color='gray'>
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
