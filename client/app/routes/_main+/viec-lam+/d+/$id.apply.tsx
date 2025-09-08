import { Link, useFetcher } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import TextEditor from '~/components/TextEditor';
import { Button } from '~/components/ui/button';
import { data, ActionFunctionArgs } from '@remix-run/node';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '~/components/ui/card';
import { isAuthenticated } from '~/services/auth.server';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { applyToJob } from '~/services/jobApplication.server';

export default function ApplyJobPost() {
  const [message, setMessage] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const toastIdRef = useRef<any>(null);
  const jobAppFetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (message.trim() !== '') {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [message]);

  useEffect(() => {
    if (jobAppFetcher.data) {
      setMessage(''); // Reset message after successful submission
      setIsChanged(false); // Reset change state
      jobAppFetcher.data.toast &&
        toast.update(toastIdRef.current, {
          render: jobAppFetcher.data.toast.message,
          type:
            jobAppFetcher.data.toast.type === 'success' ? 'success' : 'error',
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: true,
          draggable: true,
          progress: undefined,
        }); // Show toast if available
    }
  }, [jobAppFetcher.data]);

  return (
    <jobAppFetcher.Form
      method='POST'
      className='flex-1'
      onSubmit={(e) => {
        if (!isChanged || message.trim() === '') {
          toast.error('Vui lòng nhập thư xin việc trước khi gửi.');
          e.preventDefault();
          return;
        }
        toastIdRef.current = toast.loading('Đang gửi ứng tuyển...');
      }}
    >
      <Card className='w-full p-6'>
        <CardHeader>
          <CardTitle className='flex justify-between mb-2'>
            <h2 className='text-2xl'>Ứng tuyển việc làm</h2>

            <Button variant='outline' asChild className='self-start'>
              <Link to='..'>Hủy</Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Vui lòng điền thông tin và gửi thư xin việc của bạn. Chúng tôi sẽ
            xem xét và liên hệ lại với bạn trong thời gian sớm nhất.
          </CardDescription>
        </CardHeader>

        <CardContent className='col-span-12 flex flex-col gap-3'>
          <h2>Thư xin việc</h2>

          <div className='h-96'>
            <TextEditor
              value={message}
              onChange={setMessage}
              placeholder='Viết thư xin việc của bạn tại đây...'
              name='message'
            />
          </div>
        </CardContent>

        <CardFooter className='flex justify-end'>
          <Button
            type='submit'
            disabled={jobAppFetcher.state !== 'idle'}
            className='w-full sm:w-auto'
          >
            {jobAppFetcher.state !== 'idle' ? (
              <>
                <Loader2Icon className='animate-spin' />
                <span className='ml-2'>Đang gửi...</span>
              </>
            ) : (
              'Gửi ứng tuyển'
            )}
          </Button>
        </CardFooter>
      </Card>
    </jobAppFetcher.Form>
  );
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data(
      {
        toast: { type: 'error', message: 'Bạn cần đăng nhập để ứng tuyển.' },
      },
      { headers, status: 401 },
    );
  }

  try {
    switch (request.method) {
      case 'POST': {
        const formData = await request.formData();
        const message = formData.get('message');

        if (!message || typeof message !== 'string' || message.trim() === '') {
          return data(
            {
              toast: { type: 'error', message: 'Vui lòng nhập thư xin việc.' },
            },
            { headers },
          );
        }

        const jobId = params.id;
        if (!jobId) {
          return data(
            {
              toast: { type: 'error', message: 'Không tìm thấy việc làm.' },
            },
            { headers },
          );
        }

        await applyToJob(jobId, message, session);

        return data(
          {
            toast: { type: 'success', message: 'Đã gửi ứng tuyển thành công!' },
          },
          { headers },
        );
      }

      default:
        return data(
          {
            toast: { type: 'error', message: 'Phương thức không hợp lệ.' },
          },
          { headers },
        );
    }
  } catch (error) {
    console.error('Error applying for job:', error);
    return data(
      {
        toast: {
          type: 'error',
          message: 'Đã xảy ra lỗi khi gửi ứng tuyển. Vui lòng thử lại sau.',
        },
      },
      { headers },
    );
  }
};
