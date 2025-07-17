import { useState } from 'react';
import { Button } from '~/components/ui/button';
import SectionTitle from '~/components/website/SectionTitle';
import StudentCards from './StudentCards';
import { getLabelValue } from '~/utils';

export default function StudentList() {
  const [activeCustomer, setActiveCustomer] = useState(students[0].value);
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

        <StudentCards students={students} value={activeCustomer} />

        <Button variant={'main'} className=''>
          Xem thêm
        </Button>
      </div>
    </section>
  );
}

const students = [
  {
    image: '/images/students/marketing-1.png',
    label: 'Marketing',
    value: 'marketing',
    description:
      'Học viên ngành Marketing tại Iconic Pro được trang bị kiến thức và kỹ năng cần thiết để phát triển sự nghiệp trong lĩnh vực truyền thông và quảng cáo.',
  },
  {
    label: 'Marketing',
    value: 'marketing',
    image: '/images/students/marketing-2.png',
    description:
      'Học viên ngành Marketing tại Iconic Pro được trang bị kiến thức và kỹ năng cần thiết để phát triển sự nghiệp trong lĩnh vực truyền thông và quảng cáo.',
  },
  {
    label: 'Marketing',
    value: 'marketing',
    image: '/images/students/marketing-3.png',
    description:
      'Học viên ngành Marketing tại Iconic Pro được trang bị kiến thức và kỹ năng cần thiết để phát triển sự nghiệp trong lĩnh vực truyền thông và quảng cáo.',
  },
  {
    label: 'Quản lý Spa',
    value: 'managing',
    image: '/images/students/managing-1.png',
    description:
      'Học viên ngành Quản lý Spa tại Iconic Pro được đào tạo các kỹ năng quản lý, điều hành và phát triển kinh doanh trong lĩnh vực làm đẹp.',
  },
  {
    label: 'Quản lý Spa',
    value: 'managing',
    image: '/images/students/managing-2.png',
    description:
      'Học viên ngành Quản lý Spa tại Iconic Pro được đào tạo các kỹ năng quản lý, điều hành và phát triển kinh doanh trong lĩnh vực làm đẹp.',
  },
  {
    label: 'Quản lý Spa',
    value: 'managing',
    image: '/images/students/managing-3.png',
    description:
      'Học viên ngành Quản lý Spa tại Iconic Pro được đào tạo các kỹ năng quản lý, điều hành và phát triển kinh doanh trong lĩnh vực làm đẹp.',
  },
  {
    label: 'Telesales',
    value: 'tele-sales',
    image: '/images/students/telesales-1.png',
    description:
      'Học viên ngành Tele Sales tại Iconic Pro được trang bị kỹ năng giao tiếp và bán hàng qua điện thoại, giúp họ thành công trong lĩnh vực kinh doanh trực tuyến.',
  },
  {
    label: 'Telesales',
    value: 'tele-sales',
    image: '/images/students/telesales-2.png',
    description:
      'Học viên ngành Tele Sales tại Iconic Pro được trang bị kỹ năng giao tiếp và bán hàng qua điện thoại, giúp họ thành công trong lĩnh vực kinh doanh trực tuyến.',
  },
  {
    label: 'Telesales',
    value: 'tele-sales',
    image: '/images/students/telesales-3.png',
    description:
      'Học viên ngành Telesales tại Iconic Pro được trang bị kỹ năng giao tiếp và bán hàng qua điện thoại, giúp họ thành công trong lĩnh vực kinh doanh trực tuyến.',
  },
  {
    label: 'Chăm sóc khách hàng',
    value: 'customer-care',
    image: '/images/students/consulting-1.png',
    description:
      'Học viên ngành Chăm sóc khách hàng tại Iconic Pro được đào tạo kỹ năng giao tiếp, xử lý tình huống và xây dựng mối quan hệ với khách hàng.',
  },
  {
    label: 'Chăm sóc khách hàng',
    value: 'customer-care',
    image: '/images/students/consulting-2.png',
    description:
      'Học viên ngành Chăm sóc khách hàng tại Iconic Pro được đào tạo kỹ năng giao tiếp, xử lý tình huống và xây dựng mối quan hệ với khách hàng.',
  },
  {
    label: 'Chăm sóc khách hàng',
    value: 'customer-care',
    image: '/images/students/consulting-3.png',
    description:
      'Học viên ngành Chăm sóc khách hàng tại Iconic Pro được đào tạo kỹ năng giao tiếp, xử lý tình huống và xây dựng mối quan hệ với khách hàng.',
  },
];
