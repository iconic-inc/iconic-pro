import { type MetaFunction } from '@remix-run/node';
import { getAppSettings } from '~/services/app.server';
import MainSlider from './_components/MainSlider';
import HotCourses from './_components/HotCourses';
import DiscountParty from './_components/DiscountParty';
import BranchList from './_components/BranchList';
import Facilities from './_components/Facilities';
import LecturerList from './_components/LecturerList';
import Ambassador from './_components/Ambassador';
import StudentList from './_components/StudentList';
import BeautyBlog from './_components/BeautyBlog';
import PressMedia from './_components/PressMedia';
import Prizes from './_components/Prizes';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { action } from '~/routes/api+/courses+/register';
import { LoaderCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { getPosts } from '~/services/page.server';
import { getBranches } from '~/services/branch.server';

export const loader = async () => {
  try {
    const appSettings = await getAppSettings();
    const posts = getPosts().catch((error) => {
      console.error('Error fetching posts:', error);
      return [];
    });
    const branches = getBranches().catch((error) => {
      console.error('Error fetching branches:', error);
      return [];
    });

    return {
      appSettings,
      posts,
      branches,
    };
  } catch (error) {
    console.error('Error in loader:', error);
    return {
      appSettings: null,
      posts: [],
      branches: [],
    };
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { appSettings } = data || {};
  return [
    { title: appSettings?.app_title || 'Iconic Pro' },
    {
      name: 'description',
      content:
        appSettings?.app_description ||
        'Iconic Pro - Học viện Kỹ năng Chuyên nghiệp Ngành Làm đẹp.',
    },
  ];
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openPopup() {
    setIsDialogOpen(true);
  }

  function closePopup() {
    setIsDialogOpen(false);
  }

  // Make openPopup available globally
  useEffect(() => {
    (window as any).openRegistrationPopup = openPopup;

    return () => {
      delete (window as any).openRegistrationPopup;
    };
  }, []);

  const fetcher = useFetcher<typeof action>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('marketing');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !phone || !course) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    fetcher.submit(
      {
        name,
        phone,
        course,
      },
      {
        method: 'POST',
        action: '/api/courses/register',
      },
    );
  }

  useEffect(() => {
    if (fetcher.data) {
      const { success, message } = fetcher.data;
      if (success) {
        alert(message || 'Đăng ký thành công!');
        setName('');
        setPhone('');
        setCourse('');
      } else if (message) {
        alert(message);
      }

      closePopup();
      setIsLoading(false);
    }
  }, [fetcher.data]);

  return (
    <>
      <MainSlider />

      <div className='container grid-cols-1 mx-auto mb-1.5'>
        <h1 className='text-sm text-main font-bold text-center uppercase'>
          Iconic PRO - Học viện Kỹ năng Chuyên nghiệp Ngành Làm đẹp
        </h1>
      </div>

      <HotCourses />

      <DiscountParty />

      <BranchList />

      <Facilities />

      <LecturerList />

      <Ambassador />

      <Prizes />

      <StudentList />

      <BeautyBlog blogs={posts} />

      <PressMedia />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-md mx-4 md:mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl text-[--yellow] font-bold uppercase text-center'>
              Đăng Ký Khóa Học
            </DialogTitle>
          </DialogHeader>

          <div className='text-center mb-6'>
            <p className='text-gray-600 mt-1'>
              Điền thông tin để nhận tư vấn miễn phí
            </p>
          </div>

          <fetcher.Form
            id='registration-form'
            className='space-y-4 text-gray-700'
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Họ và tên <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='Nhập họ và tên của bạn'
              />
            </div>

            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Số điện thoại <span className='text-red-500'>*</span>
              </label>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                placeholder='Nhập số điện thoại của bạn'
              />
              {phone === '' ||
              /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phone) ? null : (
                <p className='text-red-500 text-xs mt-1'>
                  Số điện thoại không hợp lệ. Vui lòng nhập lại.
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Khóa học bạn quan tâm <span className='text-red-500'>*</span>
              </label>
              <div className='space-y-2'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    id='course-marketing'
                    name='course'
                    value='marketing'
                    checked={course === 'marketing'}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    className='h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300'
                  />
                  <label
                    htmlFor='course-marketing'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Khóa Học Thực Chiến Marketing
                  </label>
                </div>

                <div className='flex items-center'>
                  <input
                    type='radio'
                    id='course-telesales'
                    name='course'
                    value='telesales'
                    checked={course === 'telesales'}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    className='h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300'
                  />
                  <label
                    htmlFor='course-telesales'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Khóa Học Thực Chiến Telesales
                  </label>
                </div>

                <div className='flex items-center'>
                  <input
                    type='radio'
                    id='course-consultant'
                    name='course'
                    value='consultant'
                    checked={course === 'consultant'}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    className='h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300'
                  />
                  <label
                    htmlFor='course-consultant'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Khóa Học Thực Chiến Tư Vấn Viên
                  </label>
                </div>

                <div className='flex items-center'>
                  <input
                    type='radio'
                    id='course-management'
                    name='course'
                    value='management'
                    checked={course === 'management'}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    className='h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300'
                  />
                  <label
                    htmlFor='course-management'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Khóa Học Thực Chiến Quản Lý Spa
                  </label>
                </div>
              </div>
            </div>

            <div className='pt-2'>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-[--secondary-color] text-white font-bold py-2.5 px-4 rounded-md transition duration-300 uppercase disabled:opacity-50 hover:bg-[--secondary-color] hover:shadow-lg'
              >
                Đăng Ký Ngay
                {isLoading && (
                  <LoaderCircle className='inline-block ml-2 animate-spin h-5 w-5 text-white' />
                )}
              </button>
            </div>
          </fetcher.Form>

          <p className='text-xs text-gray-500 mt-4 text-center'>
            Bằng việc đăng ký, bạn đồng ý nhận thông tin tư vấn từ chúng tôi
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
