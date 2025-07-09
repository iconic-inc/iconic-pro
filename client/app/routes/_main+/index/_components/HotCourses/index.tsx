import { useState } from 'react';
import CourseCard from './CourseCards';
import SectionTitle from '~/components/website/SectionTitle';
import { getLabelValue } from '~/utils';

export default function HotCourses() {
  const [activeTab, setActiveTab] = useState(services[0].value);
  return (
    <div className='container grid-cols-1 gap-4'>
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
    label: 'Khóa học Marketing',
    image: '/images/courses/marketing.png',
    value: 'marketing',
    description:
      'Khóa học Marketing tại Iconic Pro giúp bạn nắm vững các chiến lược và kỹ năng cần thiết để phát triển thương hiệu cá nhân trong ngành làm đẹp. Từ việc xây dựng thương hiệu cá nhân đến quản lý mạng xã hội, khóa học này sẽ trang bị cho bạn những kiến thức và công cụ cần thiết để thành công.',
  },
  {
    label: 'Khóa học Tư vấn Khách hàng',
    image: '/images/courses/consulting.png',
    value: 'consulting',
    description:
      'Khóa học Tư vấn Khách hàng tại Iconic Pro giúp bạn phát triển kỹ năng giao tiếp và tư vấn chuyên nghiệp trong ngành làm đẹp. Bạn sẽ học cách hiểu nhu cầu của khách hàng, cung cấp giải pháp phù hợp và xây dựng mối quan hệ lâu dài với khách hàng.',
  },
  {
    label: 'Khóa học Tele Sales',
    image: '/images/courses/telesales.png',
    value: 'telesales',
    description:
      'Khóa học Tele Sales tại Iconic Pro giúp bạn nắm vững kỹ năng bán hàng qua điện thoại, từ việc tạo ấn tượng ban đầu đến việc chốt đơn hàng. Bạn sẽ học cách giao tiếp hiệu quả, xử lý từ chối và xây dựng mối quan hệ với khách hàng qua điện thoại.',
  },
  {
    label: 'Khóa học Quản lý Spa',
    image: '/images/courses/managing.png',
    value: 'managing',
    description:
      'Khóa học Quản lý Spa tại Iconic Pro giúp bạn phát triển kỹ năng quản lý và điều hành một spa thành công. Bạn sẽ học cách quản lý nhân sự, tài chính, marketing và dịch vụ khách hàng để đảm bảo hoạt động hiệu quả và mang lại trải nghiệm tốt nhất cho khách hàng.',
  },
];
