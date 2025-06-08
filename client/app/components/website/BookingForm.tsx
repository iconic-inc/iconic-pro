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

export default function BookingForm() {
  const bookingFetcher = useFetcher<typeof action>();
  const [formData, setFormData] = useState({
    name: '',
    msisdn: '',
    spaName: '',
    note: '',
  });
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleInputChange = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (bookingFetcher.data) {
      const { success, message } = bookingFetcher.data;
      if (success) {
        setSubmitMessage({ type: 'success', message });
        setFormData({
          name: '',
          msisdn: '',
          spaName: '',
          note: '',
        });
      } else {
        setSubmitMessage({ type: 'error', message });
      }
      document.getElementById('booking-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [bookingFetcher.data]);

  return (
    <Card className='w-full mx-auto'>
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
        >
          <div className='space-y-2'>
            <Label htmlFor='name'>
              Họ và Tên <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder='Nhập họ và tên của bạn'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='msisdn'>
              Số Điện Thoại <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='msisdn'
              name='msisdn'
              value={formData.msisdn}
              required
              placeholder='Nhập số điện thoại của bạn'
              pattern='[0-9]+'
              onChange={handleInputChange}
              title='Vui lòng nhập số điện thoại hợp lệ (chỉ nhập số)'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='spaName'>
              Nhập tên Spa của bạn <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='spaName'
              name='spaName'
              value={formData.spaName}
              onChange={handleInputChange}
              required
              placeholder='Nhập tên spa hoặc cơ sở của bạn'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='note'>Ghi Chú Thêm</Label>
            <Textarea
              id='note'
              name='note'
              value={formData.note}
              onChange={handleInputChange}
              placeholder='Yêu cầu đặc biệt hoặc thông tin bổ sung'
              rows={4}
            />
          </div>

          <div className='pt-2'>
            <Button
              type='submit'
              disabled={bookingFetcher.state === 'submitting'}
              className='w-full'
              variant='default'
            >
              {bookingFetcher.state === 'submitting'
                ? 'Đang gửi...'
                : 'Đăng ký ngay'}
            </Button>
          </div>
        </bookingFetcher.Form>
      </CardContent>
    </Card>
  );
}
