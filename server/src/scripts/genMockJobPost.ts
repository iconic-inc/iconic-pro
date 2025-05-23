require('dotenv').config();
import { JobPostService } from '@services/jobPost.service';
import { mongodbInstance } from '../db/init.mongodb';
import { IJobPostAttrs } from 'src/api/interfaces/jobPost.interface';
import { SpaOwnerService } from '@services/spaOwner.service';

async function main() {
  await mongodbInstance.connect();

  const owners = await SpaOwnerService.listSpaOwners({
    limit: 9999,
    status: 'active',
  });
  const ownerIds = owners.data.map((owner) => owner.id);

  for (const jpo of jobPosts) {
    await JobPostService.createJobPost({
      ...jpo,
      owner: ownerIds[Math.floor(Math.random() * ownerIds.length)],
      title: jpo.title!,
      description: jpo.description!,
    });
  }

  console.log('Mock spa owners created successfully');

  await mongodbInstance.disconnect();
}

const jobPosts: Array<Partial<IJobPostAttrs>> = [
  {
    title: 'Chuyên viên massage mặt',
    description:
      'Thực hiện các liệu trình massage mặt chuyên sâu cho khách hàng tại spa cao cấp.',
    requirements:
      'Có chứng chỉ đào tạo massage. Ưu tiên người có kinh nghiệm trên 1 năm.',
    salaryFrom: 7000000,
    salaryTo: 10000000,
    currency: 'VND',
    type: 'full-time',
    status: 'active',
    deadline: new Date('2025-06-30'),
    applicantCount: 5,
  },
  {
    title: 'Kỹ thuật viên phun xăm thẩm mỹ',
    description:
      'Thực hiện các dịch vụ phun xăm chân mày, môi,... với trang thiết bị hiện đại.',
    requirements:
      'Tối thiểu 1 năm kinh nghiệm, tay nghề vững, có gu thẩm mỹ tốt.',
    salaryFrom: 10000000,
    salaryTo: 15000000,
    currency: 'VND',
    type: 'full-time',
    status: 'active',
    deadline: new Date('2025-07-15'),
    applicantCount: 2,
  },
  {
    title: 'Nhân viên lễ tân Spa (Ca chiều)',
    description:
      'Tiếp đón khách hàng, sắp xếp lịch hẹn, hỗ trợ dịch vụ chăm sóc khách hàng.',
    requirements: 'Giọng nói dễ nghe, ngoại hình ưa nhìn, giao tiếp tốt.',
    salaryFrom: 4000000,
    salaryTo: 6000000,
    currency: 'VND',
    type: 'part-time',
    status: 'active',
    deadline: new Date('2025-06-10'),
    applicantCount: 0,
  },
];

main();
