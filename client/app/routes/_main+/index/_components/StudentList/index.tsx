import { useState } from 'react';
import { Button } from '~/components/ui/button';
import SectionTitle from '~/components/website/SectionTitle';
import StudentCards from './StudentCards';
import { getLabelValue } from '~/utils';
import { IImage } from '~/interfaces/image.interface';
import { IMAGE } from '~/constants/image.constant';

export default function StudentList({
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
  const students = [
    {
      ...IMAGE.TYPE.MARKETING_STUDENT,
      images: marketingImages,
    },
    {
      ...IMAGE.TYPE.TELESALES_STUDENT,
      images: telesalesImages,
    },
    {
      ...IMAGE.TYPE.CONSULTANT_STUDENT,
      images: consultantImages,
    },
    {
      ...IMAGE.TYPE.MANAGEMENT_STUDENT,
      images: managementImages,
    },
  ];

  const [activeCustomer, setActiveCustomer] = useState<string>(
    students[0].value,
  );

  return (
    <section id='customer' className=''>
      <div className='container grid-cols-1 gap-4'>
        <SectionTitle
          tabs={getLabelValue(students)}
          activeTab={activeCustomer}
          changeTabHandler={(tab) => setActiveCustomer(tab)}
        >
          HÌNH ẢNH THỰC TẾ CỦA HỌC VIÊN
        </SectionTitle>

        <StudentCards
          students={
            students.find((student) => student.value === activeCustomer)!
          }
        />

        <Button variant={'main'} className=''>
          Xem thêm
        </Button>
      </div>
    </section>
  );
}
