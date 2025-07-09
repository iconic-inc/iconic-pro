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

export const loader = async () => {
  try {
    const appSettings = await getAppSettings();

    return {
      appSettings,
    };
  } catch (error) {
    console.error('Error in loader:', error);
    return {
      appSettings: null,
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

      <BeautyBlog />

      <PressMedia />
    </>
  );
}
