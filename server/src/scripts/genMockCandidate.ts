require('dotenv').config();
import { CandidateService } from '@services/candidate.service';
import { mongodbInstance } from '../db/init.mongodb';
import { IUserAttrs } from 'src/api/interfaces/user.interface';
import { ICandidateAttrs } from 'src/api/interfaces/candidate.interface';

async function main() {
  await mongodbInstance.connect();

  for (const can of candidates) {
    await CandidateService.createCandidate(can);
  }

  console.log('Mock candidates created successfully');

  await mongodbInstance.disconnect();
}

const candidates: Array<IUserAttrs & ICandidateAttrs> = [
  {
    username: 'client2',
    email: 'elegancebeauty@beautymap.com',
    firstName: 'Linh',
    lastName: 'Nguyen',
    slug: 'linh-nguyen',
    password: 'hashedPassword456',
    salt: 'salt456',
    address: '456 Tranquil Lane, District 3, HCMC',
    birthdate: new Date('1990-04-22'),
    msisdn: '+84909876543',
    sex: 'female',
    status: 'active',
    role: '' as any,
    user: '' as any,
    experience: '3 years as a facial specialist',
    skills: ['facial treatment', 'product knowledge'],
    cvFile: 'cv_linh_nguyen.pdf',
    summary:
      'Dedicated esthetician with strong client communication and skin care expertise.',
  },
  {
    username: 'client3',
    email: 'tranquiltherapist@beautymap.com',
    firstName: 'Minh',
    lastName: 'Tran',
    slug: 'minh-tran',
    password: 'hashedPassword789',
    salt: 'salt789',
    address: '789 Zen Street, District 7, HCMC',
    birthdate: new Date('1988-11-09'),
    msisdn: '+84908765432',
    sex: 'male',
    status: 'active',
    role: '' as any,
    user: '' as any,
    experience: '6 years in body massage therapy',
    skills: ['deep tissue massage', 'client retention'],
    cvFile: 'cv_minh_tran.pdf',
    summary:
      'Experienced massage therapist with a calm approach and loyal client base.',
  },
  {
    username: 'client4',
    email: 'reception.pro@beautymap.com',
    firstName: 'Anh',
    lastName: 'Le',
    slug: 'anh-le',
    password: 'hashedPassword321',
    salt: 'salt321',
    address: '101 Welcome Rd, District 2, HCMC',
    birthdate: new Date('1995-03-15'),
    msisdn: '+84907654321',
    sex: 'female',
    status: 'inactive',
    role: '' as any,
    user: '' as any,
    experience: '2 years at spa front desk',
    skills: ['scheduling', 'POS system'],
    cvFile: 'cv_anh_le.pdf',
    summary:
      'Friendly receptionist skilled in handling client appointments and payments efficiently.',
  },
  {
    username: 'client5',
    email: 'glowartist@beautymap.com',
    firstName: 'Huy',
    lastName: 'Pham',
    slug: 'huy-pham',
    password: 'hashedPassword654',
    salt: 'salt654',
    address: '22 Radiance Ave, District 10, HCMC',
    birthdate: new Date('1982-09-03'),
    msisdn: '+84906543210',
    sex: 'male',
    status: 'active',
    role: '' as any,
    user: '' as any,
    experience: '4 years in skin lightening treatments',
    skills: ['laser treatment', 'consultation'],
    cvFile: 'cv_huy_pham.pdf',
    summary:
      'Skin care expert focused on modern laser and skin rejuvenation techniques.',
  },
  {
    username: 'client6',
    email: 'serenity.admin@beautymap.com',
    firstName: 'Trang',
    lastName: 'Vo',
    slug: 'trang-vo',
    password: 'hashedPassword987',
    salt: 'salt987',
    address: '88 Peace Road, District 5, HCMC',
    birthdate: new Date('1993-12-28'),
    msisdn: '+84905432109',
    sex: 'female',
    status: 'active',
    role: '' as any,
    user: '' as any,
    experience: '1 year as a spa admin assistant',
    skills: ['inventory tracking', 'admin coordination'],
    cvFile: 'cv_trang_vo.pdf',
    summary:
      'Organized and detail-oriented admin assistant with strong coordination skills.',
  },
];

main();
