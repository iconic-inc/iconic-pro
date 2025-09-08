import { FormEvent, useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { useFetcher } from '@remix-run/react';
import { action } from '~/routes/api+/booking+';
import { LoaderCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { COURSE_LEVELS, COURSES } from '~/constants/courses.constant';

export default function BookingForm() {
  const bookingFetcher = useFetcher<typeof action>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [courseLevel, setCourseLevel] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage(null);

    if (!name || !phone || !course || !courseLevel) {
      setSubmitMessage({
        type: 'error',
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
      });
      setIsLoading(false);
      return;
    }

    bookingFetcher.submit(
      {
        name,
        phone,
        course,
        courseLevel,
        note,
      },
      {
        method: 'POST',
        action: '/api/courses/register',
      },
    );
  };

  useEffect(() => {
    if (bookingFetcher.data) {
      const { success, message } = bookingFetcher.data;
      if (success) {
        setSubmitMessage({ type: 'success', message });
        setName('');
        setPhone('');
        setCourse('');
        setCourseLevel('');
        setNote('');
      } else {
        setSubmitMessage({ type: 'error', message });
      }
      setIsLoading(false);
      document.getElementById('booking-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [bookingFetcher.data]);

  return (
    <Card className='w-full mx-auto shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center'>
          Đặt lịch tư vấn
        </CardTitle>

        <CardDescription className='text-center text-muted-foreground'>
          Vui lòng điền thông tin dưới đây để đăng ký tư vấn miễn phí.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitMessage && (
          <div
            className={`p-4 mb-4 rounded-md ${
              submitMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {submitMessage.message}
          </div>
        )}

        <bookingFetcher.Form
          id='booking-form'
          className='space-y-6'
          method='POST'
          action='/api/booking'
          onSubmit={handleSubmit}
        >
          <div>
            <Label htmlFor='name'>
              Họ và tên <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='text'
              id='name'
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='h-12'
              placeholder='Nhập họ và tên của bạn'
              autoComplete='name'
            />
          </div>

          <div>
            <Label htmlFor='phone'>
              Số điện thoại <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='tel'
              id='phone'
              name='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className='h-12'
              placeholder='Nhập số điện thoại của bạn'
              autoComplete='tel'
            />
            {phone === '' ||
            /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phone) ? null : (
              <p className='text-red-500 text-xs mt-1'>
                Số điện thoại không hợp lệ. Vui lòng nhập lại.
              </p>
            )}
          </div>

          <div>
            <Label>
              Khóa học bạn quan tâm <span className='text-red-500'>*</span>
            </Label>
            <Select value={course} onValueChange={setCourse} name='course'>
              <SelectTrigger className='h-12'>
                <SelectValue placeholder='Chọn khóa học...' />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((courseOption) => (
                  <SelectItem
                    key={courseOption.value}
                    value={courseOption.value}
                  >
                    {courseOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              Cấp độ khóa học <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={courseLevel}
              onValueChange={setCourseLevel}
              name='courseLevel'
            >
              <SelectTrigger className='h-12'>
                <SelectValue placeholder='Chọn cấp độ...' />
              </SelectTrigger>
              <SelectContent>
                {COURSE_LEVELS.map((levelOption) => (
                  <SelectItem key={levelOption.value} value={levelOption.value}>
                    {levelOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='note'>Ghi chú</Label>
            <Textarea
              id='note'
              name='note'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='min-h-[100px]'
              placeholder='Nhập ghi chú thêm (tùy chọn)'
            />
          </div>

          <div className='pt-2'>
            <Button
              type='submit'
              disabled={isLoading}
              variant={'main'}
              className='w-full h-12'
            >
              Đặt Lịch Tư Vấn
              {isLoading && (
                <LoaderCircle className='inline-block ml-2 animate-spin h-5 w-5 text-white' />
              )}
            </Button>
          </div>
        </bookingFetcher.Form>
      </CardContent>
    </Card>
  );
}
