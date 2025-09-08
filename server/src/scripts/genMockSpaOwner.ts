require('dotenv').config();
import { ISpaOwnerAttrs } from 'src/api/interfaces/spaOwner.interface';
import { mongodbInstance } from '../db/init.mongodb';
import { IUserAttrs } from 'src/api/interfaces/user.interface';
import { SpaOwnerService } from '@services/spaOwner.service';

async function main() {
  await mongodbInstance.connect();

  for (const spo of spaOnwers) {
    await SpaOwnerService.createSpaOwner(spo);
  }

  console.log('Mock spa owners created successfully');

  await mongodbInstance.disconnect();
}

const spaOnwers: Array<IUserAttrs & ISpaOwnerAttrs> = [
  {
    username: 'spaowner1',
    email: 'luxuryspa@beautymap.com',
    firstName: 'Sophia',
    lastName: 'Chen',
    slug: 'sophia-chen',
    password: 'hashedPassword123', // Will be hashed in real implementation
    salt: 'salt123',
    address: '123 Wellness Avenue, District 1, HCMC',
    birthdate: new Date('1985-07-12'),
    msisdn: '+84901234567',
    sex: 'female',
    status: 'active',
    level: 'owner',
    plan: 'premium',
    role: '' as any,
  },
  {
    username: 'spaowner2',
    email: 'elegance.spa@beautymap.com',
    firstName: 'Linh',
    lastName: 'Nguyen',
    slug: 'linh-nguyen',
    password: 'hashedPassword456',
    salt: 'salt456',
    address: '456 Serenity Street, District 3, HCMC',
    birthdate: new Date('1990-04-22'),
    msisdn: '+84909876543',
    sex: 'female',
    status: 'active',
    level: 'owner',
    plan: 'standard',
    role: '' as any,
  },
  {
    username: 'spaowner3',
    email: 'tranquilspa@beautymap.com',
    firstName: 'Minh',
    lastName: 'Tran',
    slug: 'minh-tran',
    password: 'hashedPassword789',
    salt: 'salt789',
    address: '789 Peaceful Blvd, District 7, HCMC',
    birthdate: new Date('1988-11-09'),
    msisdn: '+84908765432',
    sex: 'male',
    status: 'active',
    level: 'owner',
    plan: 'premium',
    role: '' as any,
  },
  {
    username: 'spaowner4',
    email: 'reviveskin@beautymap.com',
    firstName: 'Anh',
    lastName: 'Le',
    slug: 'anh-le',
    password: 'hashedPassword321',
    salt: 'salt321',
    address: '101 Rejuvenation Road, District 2, HCMC',
    birthdate: new Date('1995-03-15'),
    msisdn: '+84907654321',
    sex: 'female',
    status: 'active',
    level: 'owner',
    plan: 'basic',
    role: '' as any,
  },
  {
    username: 'spaowner5',
    email: 'glowbeauty@beautymap.com',
    firstName: 'Huy',
    lastName: 'Pham',
    slug: 'huy-pham',
    password: 'hashedPassword654',
    salt: 'salt654',
    address: '22 Radiance Lane, District 10, HCMC',
    birthdate: new Date('1982-09-03'),
    msisdn: '+84906543210',
    sex: 'male',
    status: 'active',
    level: 'owner',
    plan: 'premium',
    role: '' as any,
  },
  {
    username: 'spaowner6',
    email: 'serenitytouch@beautymap.com',
    firstName: 'Trang',
    lastName: 'Vo',
    slug: 'trang-vo',
    password: 'hashedPassword987',
    salt: 'salt987',
    address: '88 Calmness Road, District 5, HCMC',
    birthdate: new Date('1993-12-28'),
    msisdn: '+84905432109',
    sex: 'female',
    status: 'active',
    level: 'owner',
    plan: 'standard',
    role: '' as any,
  },
];

main();
