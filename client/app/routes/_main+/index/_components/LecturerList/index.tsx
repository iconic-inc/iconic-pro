import { useState } from 'react';
import SectionTitle from '~/components/website/SectionTitle';
import LecturerCards from './LecturerCards';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import { getLabelValue } from '~/utils';

export default function LecturerList() {
  const [activeLecturer, setActiveLecturer] = useState(members[0].value);

  return (
    <section id='members' className=''>
      <div className='container grid-cols-1 gap-4'>
        <SectionTitle
          tabs={getLabelValue(members)}
          activeTab={activeLecturer}
          changeTabHandler={(tab) => setActiveLecturer(tab)}
        >
          ĐỘI NGŨ GIẢNG VIÊN
        </SectionTitle>

        <LecturerCards lecturers={members} value={activeLecturer} />

        <Button variant={'main'} className='w-fit mx-auto'>
          <Link to='#'>Tìm hiểu thêm</Link>
        </Button>
      </div>
    </section>
  );
}

const members = [
  {
    name: 'Phạm Văn Thanh',
    label: 'Quản lý Spa',
    value: 'managing',
    image: '/images/lecturers/pham-van-thanh.png',
    descriptions: [
      'Hơn 10 năm kinh nghiệm trong ngành làm đẹp',
      'Chuyên gia trong lĩnh vực quản lý spa và đào tạo nhân viên',
    ],
  },
  {
    name: 'Kiều Nguyễn',
    label: 'Quản lý Spa',
    value: 'managing',
    image: '/images/lecturers/kieu-nguyen.png',
    descriptions: [
      'Hơn 8 năm kinh nghiệm trong ngành làm đẹp',
      'Chuyên gia trong lĩnh vực quản lý spa và đào tạo nhân viên',
    ],
  },
  {
    name: 'Huỳnh Tấn Thời',
    label: 'Marketing',
    value: 'marketing',
    image: '/images/lecturers/huynh-tan-thoi.png',
    descriptions: [
      'Hơn 10 năm kinh nghiệm trong lĩnh vực marketing',
      'Chuyên gia trong việc xây dựng thương hiệu và chiến lược marketing cho spa',
    ],
  },
  {
    name: 'Phạm Văn Thanh',
    label: 'Marketing',
    value: 'marketing',
    image: '/images/lecturers/pham-van-thanh.png',
    descriptions: [
      'Hơn 10 năm kinh nghiệm trong ngành làm đẹp',
      'Chuyên gia trong lĩnh vực quản lý spa và đào tạo nhân viên',
    ],
  },
  {
    name: 'Nguyễn Lê Quốc Cường',
    label: 'Chăm sóc khách hàng',
    value: 'customer_service',
    image: '/images/lecturers/nguyen-le-quoc-cuong.png',
    descriptions: [
      'Hơn 7 năm kinh nghiệm trong lĩnh vực chăm sóc khách hàng',
      'Chuyên gia trong việc xây dựng mối quan hệ với khách hàng và giải quyết các vấn đề liên quan đến dịch vụ',
    ],
  },
  {
    name: 'Huỳnh Việt Trinh',
    label: 'Chăm sóc khách hàng',
    value: 'customer_service',
    image: '/images/lecturers/huynh-viet-trinh.png',
    descriptions: [
      'Hơn 6 năm kinh nghiệm trong lĩnh vực chăm sóc khách hàng',
      'Chuyên gia trong việc xây dựng mối quan hệ với khách hàng và giải quyết các vấn đề liên quan đến dịch vụ',
    ],
  },
  {
    name: 'Huỳnh Việt Trinh',
    label: 'Telesales',
    value: 'telesales',
    image: '/images/lecturers/huynh-viet-trinh.png',
    descriptions: [
      'Hơn 6 năm kinh nghiệm trong lĩnh vực telesales',
      'Chuyên gia trong việc tư vấn và bán hàng qua điện thoại',
    ],
  },
  {
    name: 'Nguyễn Lê Quốc Cường',
    label: 'Telesales',
    value: 'telesales',
    image: '/images/lecturers/nguyen-le-quoc-cuong.png',
    descriptions: [
      'Hơn 7 năm kinh nghiệm trong lĩnh vực telesales',
      'Chuyên gia trong việc tư vấn và bán hàng qua điện thoại',
    ],
  },
];
