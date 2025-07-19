import { useState } from 'react';
import SectionTitle from '~/components/website/SectionTitle';
import LecturerCards from './LecturerCards';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import { IImage } from '~/interfaces/image.interface';
import { IMAGE } from '~/constants/image.constant';

export default function LecturerList({
  marketingImages,
  telesalesImages,
  consultantImages,
  managementImages,
}: {
  marketingImages: IImage[];
  telesalesImages: IImage[];
  consultantImages: IImage[];
  managementImages: IImage[];
}) {
  const lecturers = [
    {
      ...IMAGE.TYPE.MARKETING_LECTURER,
      images: marketingImages,
    },
    {
      ...IMAGE.TYPE.TELESALES_LECTURER,
      images: telesalesImages,
    },
    {
      ...IMAGE.TYPE.CONSULTANT_LECTURER,
      images: consultantImages,
    },
    {
      ...IMAGE.TYPE.MANAGEMENT_LECTURER,
      images: managementImages,
    },
  ];
  const [activeLecturer, setActiveLecturer] = useState<string>(
    lecturers[0].value,
  );

  return (
    <section id='members' className=''>
      <div className='container grid-cols-1 gap-4'>
        <SectionTitle
          tabs={lecturers}
          activeTab={activeLecturer}
          changeTabHandler={(tab) => setActiveLecturer(tab)}
        >
          ĐỘI NGŨ GIẢNG VIÊN
        </SectionTitle>

        <LecturerCards
          lecturers={lecturers.find((lec) => lec.value === activeLecturer)!}
        />

        <Button variant={'main'} className='w-fit mx-auto'>
          <Link to='#'>Tìm hiểu thêm</Link>
        </Button>
      </div>
    </section>
  );
}
