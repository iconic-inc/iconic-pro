import { Calendar, Mail, MapPin, Pen, Phone, VenusAndMars } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { formatDate } from '~/utils';
import TextRenderer from '~/components/website/TextRenderer';
import { ICandidateDetails } from '~/interfaces/candidate.interface';

export default function MyCandidateProfile({
  candidate,
  handleSwitchToUpdate,
}: {
  candidate: ICandidateDetails;
  handleSwitchToUpdate: () => void;
}) {
  const {
    can_user: user,
    can_skills: skills,
    can_summary: summary,
  } = candidate;

  return (
    <div className='col-span-12 space-y-6 sm:space-y-8'>
      <Card className='shadow-md hover:shadow-lg transition-all'>
        <CardContent className='flex justify-between p-4 sm:p-6'>
          <div className='flex flex-col items-start gap-4'>
            <div className='relative flex items-start justify-between w-full'>
              <Avatar className='w-24 h-24 border-4 border-primary-100 transition-transform hover:scale-105'>
                <AvatarImage
                  src={
                    user?.usr_avatar?.img_url || '/user-avatar-placeholder.jpg'
                  }
                  alt={user.usr_avatar?.img_name || 'User Avatar'}
                />
                <AvatarFallback>
                  {user?.usr_firstName?.charAt(0).toUpperCase() ||
                    user?.usr_lastName?.charAt(0).toUpperCase() ||
                    'U'}
                </AvatarFallback>
              </Avatar>

              <Button
                className='self-start'
                onClick={() => handleSwitchToUpdate()}
              >
                <Pen className='mr-2 h-4 w-4' />
                Chỉnh sửa hồ sơ
              </Button>
            </div>

            <div className='flex-1'>
              <h1 className='text-2xl font-bold mb-1'>{`${user?.usr_firstName} ${user?.usr_lastName}`}</h1>

              <p className='text-gray-600 mb-2'>
                {summary || 'Thêm tóm tắt hồ sơ'}
              </p>

              <div className='flex flex-wrap gap-2 mt-2 mb-4'>
                {skills && skills.length > 0 ? (
                  skills.map((skill) => (
                    <Badge key={skill} variant='outline'>
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <Badge variant='destructive'>Chưa có kỹ năng</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-12 gap-4 sm:gap-6'>
        <div className='col-span-12 lg:col-span-4'>
          <Card className='mb-6 shadow-md hover:shadow-lg transition-all'>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <Separator className='mt-2' />
            </CardHeader>
            <CardContent>
              <ul className='space-y-4'>
                <li className='flex items-start gap-3'>
                  <Mail className='text-gray-500 mt-0.5 h-5 w-5' />
                  <div>
                    <p className='font-medium'>Email</p>
                    <p className='text-gray-600'>
                      {user?.usr_email || 'Chưa có email'}
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <Phone className='text-gray-500 mt-0.5 h-5 w-5' />
                  <div>
                    <p className='font-medium'>Số điện thoại</p>
                    <p className='text-gray-600'>
                      {user.usr_msisdn || 'Chưa có Số điện thoại'}
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <MapPin className='text-gray-500 mt-0.5 h-5 w-5' />
                  <div>
                    <p className='font-medium'>Địa chỉ</p>
                    <p className='text-gray-600'>
                      {user.usr_address || 'Chưa có Địa chỉ'}
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <Calendar className='text-gray-500 mt-0.5 h-5 w-5' />
                  <div>
                    <p className='font-medium'>Ngày sinh</p>
                    <p className='text-gray-600'>
                      {(user.usr_birthdate && formatDate(user.usr_birthdate)) ||
                        'Chưa có Ngày sinh'}
                    </p>
                  </div>
                </li>

                <li className='flex items-start gap-3'>
                  <VenusAndMars className='text-gray-500 mt-0.5 h-5 w-5' />
                  <div>
                    <p className='font-medium'>Giới tính</p>
                    <p className='text-gray-600'>
                      {user.usr_sex === 'male' ? 'Nam' : 'Nữ'}
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-12 lg:col-span-8 space-y-4 sm:space-y-6'>
          {/* <Card className='shadow-md hover:shadow-lg transition-all'>
                    <CardHeader>
                      <CardTitle>Hồ sơ</CardTitle>
                      <Separator className='mt-2' />
                    </CardHeader>
                    <CardContent>
                      {candidate.can_cvFile ? (
                        <a
                          href={candidate.can_cvFile}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Button variant='outline' className='w-full'>
                            Tải xuống CV
                          </Button>
                        </a>
                      ) : (
                        <p className='text-gray-600'>Chưa có CV</p>
                      )}
                    </CardContent>
                  </Card> */}

          <Card className='shadow-md hover:shadow-lg transition-all'>
            <CardHeader className='pb-0'>
              <CardTitle>Kinh nghiệm làm việc</CardTitle>
              <Separator className='mt-2' />
            </CardHeader>
            <CardContent>
              <TextRenderer
                content={
                  candidate.can_experience || 'Chưa có kinh nghiệm làm việc'
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
