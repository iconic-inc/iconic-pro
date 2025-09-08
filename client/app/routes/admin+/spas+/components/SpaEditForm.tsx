import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import TextInput from '~/components/TextInput';
import { ISpa, ISpaDetails } from '~/interfaces/spa.interface';
import Select from '~/widgets/Select';
import { action } from '../$id_.edit';
import PasswordInput from '~/components/PasswordInput';
import CustomButton from '~/widgets/CustomButton';
import { IResponseList } from '~/interfaces/app.interface';
import { ISpaOwner } from '~/interfaces/spaOwner.interface';
import TextAreaInput from '~/components/TextAreaInput';
import Defer from '../../../../components/Defer';

export default function spaEditForm({
  spa,
  ownersPromise,
}: {
  spa: ISpaDetails;
  ownersPromise: Promise<IResponseList<ISpaOwner>>;
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
    navigate(`/admin/spas/${spa.id}`);
  };

  const { sp_owner: owner, sp_socialLinks } = spa;

  return (
    <fetcher.Form method='PUT'>
      <div className='mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Two column details */}
        <Defer resolve={ownersPromise}>
          {({ data: owners }) => (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow-sm p-6'>
                {/* Left Column - SpaOwner Info */}
                <div className='bg-white h-full border border-gray-100 rounded-md p-5 shadow-sm hover:shadow-md transition'>
                  <div className='space-y-4'>
                    <TextInput
                      label={
                        <span>
                          Tên spa <span className='text-red-500'>*</span>
                        </span>
                      }
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Nhập tên spa'
                      autoFocus
                      required
                      defaultValue={spa.sp_name}
                    />

                    <TextAreaInput
                      label='Mô tả'
                      id='description'
                      name='description'
                      placeholder='Nhập mô tả ngắn về spa'
                      rows={3}
                      defaultValue={spa.sp_description}
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
                      defaultValue={spa.sp_phone}
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
                      defaultValue={spa.sp_email}
                    />

                    <Select
                      label='Chọn chủ spa'
                      id='owner'
                      name='owner'
                      className='w-full'
                      required
                      defaultValue={owner?.id || ''}
                    >
                      <option value='' disabled>
                        Chọn chủ spa
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
                      defaultValue={spa.sp_address.formattedAddress}
                    />

                    <TextInput
                      label='Website'
                      id='website'
                      name='website'
                      type='url'
                      placeholder='https://example.com'
                      defaultValue={spa.sp_website}
                    />

                    <TextInput
                      label='Facebook'
                      id='facebook'
                      name='facebook'
                      type='url'
                      placeholder='https://facebook.com/example'
                      defaultValue={sp_socialLinks?.facebook}
                    />
                    <TextInput
                      label='Instagram'
                      id='instagram'
                      name='instagram'
                      type='url'
                      placeholder='https://instagram.com/example'
                      defaultValue={sp_socialLinks?.instagram}
                    />

                    <TextInput
                      label='Tiktok'
                      id='tiktok'
                      name='tiktok'
                      type='url'
                      placeholder='https://tiktok.com/@example'
                      defaultValue={sp_socialLinks?.tiktok}
                    />

                    <TextInput
                      label='Youtube'
                      id='youtube'
                      name='youtube'
                      type='url'
                      placeholder='https://youtube.com/@example'
                      defaultValue={sp_socialLinks?.youtube}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Defer>
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
