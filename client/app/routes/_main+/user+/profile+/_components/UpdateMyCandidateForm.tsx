import { CircleX, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Textarea } from '~/components/ui/textarea';
import { ICandidateDetails } from '~/interfaces/candidate.interface';
import { formatDate } from '~/utils';
import { USER } from '../../../../../../../server/src/api/constants/user.constant';
import { useFetcher } from '@remix-run/react';
import TextEditor from '~/components/TextEditor/index';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { action } from '..';
import ImageInput from '~/components/ImageInput';
import { IImage } from '~/interfaces/image.interface';

export default function UpdateMyCandidateForm({
  candidate,
  cancelHandler,
}: {
  candidate: ICandidateDetails;
  cancelHandler?: () => void;
}) {
  const { can_user: user } = candidate;

  const [experience, setExperience] = useState(candidate.can_experience || '');
  const [avatar, setAvatar] = useState(user.usr_avatar || ({} as IImage));
  const [isLoading, setIsLoading] = useState(false);
  const fetcher = useFetcher<typeof action>();
  const toastIdRef = useRef<any>(null);

  useEffect(() => {
    if (fetcher.data) {
      setIsLoading(false);
      const {
        toast: { message, type },
      } = fetcher.data;
      toast.update(toastIdRef.current, {
        render: message,
        type: type === 'success' ? 'success' : 'error',
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      if (type === 'success') {
        cancelHandler?.();
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
        if (
          confirm(
            'Bạn có chắc muốn rời khỏi trang này? Thông tin đã thay đổi sẽ không được lưu.',
          )
        ) {
          return true;
        }
        e.preventDefault();
      };
      window.addEventListener('beforeunload', beforeUnloadHandler);

      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }
  }, []);

  return (
    <fetcher.Form
      className='grid grid-cols-12 gap-4 sm:gap-6'
      method='POST'
      onSubmit={() => {
        setIsLoading(true);
        toastIdRef.current = toast.loading('Đang cập nhât...');
      }}
    >
      <Card className='col-span-12 shadow-md hover:shadow-lg transition-all'>
        <CardContent className='flex justify-between p-4 sm:p-6'>
          <div className='flex-1 flex flex-col items-start gap-4'>
            <div className='relative flex flex-col-reverse md:flex-row items-center md:items-start justify-between w-full gap-4 sm:gap-6'>
              <div className='w-60'>
                <ImageInput
                  value={avatar}
                  name='avatar'
                  onChange={(img) =>
                    Array.isArray(img) ? setAvatar(img[0]) : setAvatar(img)
                  }
                />
              </div>

              <div className='flex items-center gap-4'>
                <Button
                  variant='outline'
                  className='self-start'
                  type='button'
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn hủy cập nhật?')) {
                      cancelHandler?.();
                    }
                  }}
                >
                  <CircleX className='mr-2 h-4 w-4' />
                  Hủy
                </Button>

                <Button
                  variant='default'
                  className='self-start bg-[--sub4-color] hover:bg-[--sub4-color] hover:opacity-80 text-white'
                  type='submit'
                >
                  {isLoading ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          stroke-width='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>{' '}
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      Lưu hồ sơ
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className='flex-1 w-full space-y-4'>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='firstName'>Tên</Label>
                  <Input
                    id='firstName'
                    type='text'
                    defaultValue={user.usr_firstName}
                    name='firstName'
                    placeholder='Nhập tên của bạn'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <Label htmlFor='lastName'>Họ</Label>
                  <Input
                    id='lastName'
                    type='text'
                    defaultValue={user.usr_lastName}
                    name='lastName'
                    placeholder='Nhập họ của bạn'
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='summary'>
                  Tóm tắt hồ sơ
                  <Textarea
                    id='summary'
                    name='summary'
                    className='mt-2'
                    defaultValue={candidate.can_summary}
                    placeholder='Nhập tóm tắt giới thiệu về bản thân.'
                    rows={8}
                  />
                </Label>
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor='skills'>Kỹ năng</Label>
                <Input
                  id='skills'
                  name='skills'
                  defaultValue={candidate.can_skills}
                  placeholder='Nhập kỹ năng (phân cách bởi dấu phẩy [,]). Ví dụ: Phun xăm, làm nail,...'
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='col-span-12 grid grid-cols-12 gap-4 sm:gap-6'>
        <div className='col-span-12 lg:col-span-4'>
          <Card className='mb-6 shadow-md hover:shadow-lg transition-all'>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <Separator className='mt-2' />
            </CardHeader>
            <CardContent>
              <ul className='space-y-4'>
                <li className='flex items-start gap-3'>
                  <div className='flex flex-col gap-2 w-full'>
                    <Label htmlFor='email' className='font-medium'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      name='email'
                      className='text-gray-600'
                      defaultValue={user.usr_email}
                      placeholder='Nhập email của bạn'
                      readOnly
                    />
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='flex flex-col gap-2 w-full'>
                    <Label htmlFor='phone' className='font-medium'>
                      Số điện thoại
                    </Label>
                    <Input
                      id='phone'
                      name='phone'
                      className='text-gray-600'
                      defaultValue={user.usr_msisdn}
                      placeholder='Nhập số điện thoại của bạn'
                    />
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='flex flex-col gap-2 w-full'>
                    <Label htmlFor='address' className='font-medium'>
                      Địa chỉ
                    </Label>
                    <Input
                      id='address'
                      name='address'
                      className='text-gray-600'
                      defaultValue={user.usr_address}
                      placeholder='Nhập địa chỉ của bạn'
                    />
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='flex flex-col gap-2 w-full'>
                    <Label htmlFor='birthdate' className='font-medium'>
                      Ngày sinh
                    </Label>
                    <Input
                      id='birthdate'
                      name='birthdate'
                      type='date'
                      className='text-gray-600'
                      defaultValue={
                        user.usr_birthdate
                          ? formatDate(user.usr_birthdate, 'YYYY-MM-DD')
                          : ''
                      }
                    />
                  </div>
                </li>

                <li className='flex items-start gap-3'>
                  <div className='flex flex-col gap-2 w-full'>
                    <Select name='sex' defaultValue={user.usr_sex}>
                      <Label>Giới tính</Label>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Chọn giới tính' />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value={USER.SEX.MALE}>Nam</SelectItem>
                        <SelectItem value={USER.SEX.FEMALE}>Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-12 lg:col-span-8 space-y-4 sm:space-y-6'>
          <Card className='shadow-md hover:shadow-lg transition-all'>
            <CardHeader>
              <CardTitle>Kinh nghiệm làm việc</CardTitle>
              <Separator className='mt-2' />
            </CardHeader>
            <CardContent>
              <TextEditor
                value={experience}
                onChange={(value) => {
                  setExperience(value);
                }}
                name='experience'
                placeholder='Nhập kinh nghiệm làm việc của bạn...'
                className='h-60 sm:h-80'
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </fetcher.Form>
  );
}
