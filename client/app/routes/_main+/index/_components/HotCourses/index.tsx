import { useState } from 'react';
import CourseCard from './CourseCards';
import SectionTitle from '~/components/website/SectionTitle';
import { getLabelValue } from '~/utils';

export default function HotCourses() {
  const [activeTab, setActiveTab] = useState(services[0].value);
  return (
    <div id='hot-courses' className='container grid-cols-1 gap-4'>
      <SectionTitle
        tabs={getLabelValue(services)}
        activeTab={activeTab}
        changeTabHandler={setActiveTab}
      >
        Các khóa học nổi bật
      </SectionTitle>

      <CourseCard services={services} value={activeTab} />
    </div>
  );
}

const services = [
  {
    label: 'Khóa học Marketing',
    image: '/images/courses/marketing.png',
    value: 'marketing',
    description:
      'Khóa học Marketing tại Iconic Pro giúp bạn nắm vững các chiến lược và kỹ năng cần thiết để phát triển thương hiệu cá nhân trong ngành làm đẹp. Từ việc xây dựng thương hiệu cá nhân đến quản lý mạng xã hội, khóa học này sẽ trang bị cho bạn những kiến thức và công cụ cần thiết để thành công.',
  },
  {
    label: 'Khóa học Telesales',
    image: '/images/courses/telesales.png',
    value: 'telesales',
    description:
      'Khóa học Telesales tại Iconic Pro giúp bạn nắm vững các kỹ năng bán hàng qua điện thoại, từ việc tạo dựng mối quan hệ với khách hàng đến việc xử lý từ chối và chốt đơn hàng. Bạn sẽ học cách giao tiếp hiệu quả, xây dựng lòng tin và tạo ra giá trị cho khách hàng qua từng cuộc gọi.',
  },
  {
    label: 'Khóa học Tư vấn viên',
    image: '/images/courses/consultant.png',
    value: 'consultant',
    description:
      'Khóa học Tư vấn viên tại Iconic Pro giúp bạn phát triển kỹ năng tư vấn chuyên nghiệp, từ việc lắng nghe nhu cầu của khách hàng đến việc đưa ra giải pháp phù hợp. Bạn sẽ học cách xây dựng mối quan hệ với khách hàng, tạo niềm tin và mang lại giá trị thực sự cho họ.',
  },
  {
    label: 'Quản lý spa & thẩm mỹ viện',
    image: '/images/courses/spa-management.png',
    value: 'spa-management',
    description:
      'Khóa học Quản lý spa & thẩm mỹ viện tại Iconic Pro cung cấp cho bạn những kiến thức và kỹ năng cần thiết để quản lý hiệu quả một cơ sở làm đẹp. Từ quản lý nhân sự, tài chính đến marketing, khóa học này sẽ giúp bạn xây dựng và phát triển một spa thành công.',
  },
];
