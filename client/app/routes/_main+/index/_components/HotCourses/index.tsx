import { useState } from 'react';
import CourseCard from './CourseCards';
import SectionTitle from '~/components/website/SectionTitle';
import { getLabelValue } from '~/utils';
import { IImage } from '~/interfaces/image.interface';
import { IMAGE } from '~/constants/image.constant';

interface HotCoursesProps {
  marketingImages: IImage[];
  telesalesImages: IImage[];
  consultantImages: IImage[];
  managementImages: IImage[];
}

export default function HotCourses({
  marketingImages,
  telesalesImages,
  consultantImages,
  managementImages,
}: HotCoursesProps) {
  const courses = [
    {
      ...IMAGE.TYPE.MARKETING_COURSE,
      images: marketingImages,
    },
    {
      ...IMAGE.TYPE.TELESALES_COURSE,
      images: telesalesImages,
    },
    {
      ...IMAGE.TYPE.CONSULTANT_COURSE,
      images: consultantImages,
    },
    {
      ...IMAGE.TYPE.MANAGEMENT_COURSE,
      images: managementImages,
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(courses[0].value);
  return (
    <div id='hot-courses' className='container grid-cols-1 gap-4'>
      <SectionTitle
        tabs={getLabelValue(courses)}
        activeTab={activeTab}
        changeTabHandler={setActiveTab}
      >
        Các khóa học nổi bật
      </SectionTitle>

      <CourseCard courses={courses} value={activeTab} />
    </div>
  );
}
