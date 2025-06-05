import JobPostOverview from '~/widgets/JobPostOverview';
import JobPostInformation from '~/components/website/JobPostInformation';
import { data, Form, Link, useFetcher, useLoaderData } from '@remix-run/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import TextRenderer from '~/components/website/TextRenderer';
import { Button } from '~/components/ui/button';
import {
  getMyJobApplicationByIdAsCandidate,
  withdrawJobApplication,
} from '~/services/jobApplication.server';
import { parseAuthCookie } from '~/services/cookie.server';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { isAuthenticated } from '~/services/auth.server';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Loader2Icon } from 'lucide-react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const jobAppId = params.id;
  if (!jobAppId) throw new Response(null, { status: 404 });

  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const appliedApplication = await getMyJobApplicationByIdAsCandidate(
      jobAppId,
      auth,
    );
    return {
      appliedApplication,
    };
  } catch (error) {
    console.error('Error loading job application:', error);
    throw new Response('Error loading job application', { status: 500 });
  }
};

export default function () {
  const { appliedApplication } = useLoaderData<typeof loader>();

  const withdrawFetcher = useFetcher<typeof action>();
  const toastIdRef = useRef<any>(null);

  useEffect(() => {
    if (withdrawFetcher.data) {
      withdrawFetcher.data.toast &&
        toast.update(toastIdRef.current, {
          render: withdrawFetcher.data.toast.message,
          type:
            withdrawFetcher.data.toast.type === 'success' ? 'success' : 'error',
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: true,
          draggable: true,
          progress: undefined,
        }); // Show toast if available
    }
  }, [withdrawFetcher.data]);

  const { jap_jobPost: jobPost } = appliedApplication;
  return (
    <div className='col-span-12 space-y-6'>
      <JobPostOverview
        jobpost={jobPost}
        appliedApplication={appliedApplication as any}
        breadscrum={[
          {
            label: 'Trang chủ',
            path: '/',
          },
          {
            label: 'Người dùng',
            path: '/user',
          },
          {
            label: 'Đơn ứng tuyển',
            path: '/user/don-ung-tuyen',
          },
          {
            label: 'Chi tiết đơn ứng tuyển',
            path: `/user/don-ung-tuyen/${appliedApplication.id}`,
          },
        ]}
      />

      <div className='container flex flex-col-reverse md:flex-row items-start gap-6 pb-6'>
        <JobPostInformation jobpost={jobPost} />

        <Form
          method='POST'
          className='flex-1'
          onSubmit={() => {
            toastIdRef.current = toast.loading('Đang thu hồi đơn ứng tuyển...');
          }}
        >
          <Card className='w-full'>
            <CardHeader className='pb-0'>
              <CardTitle className='flex justify-between'>
                <h2 className='text-2xl'>Thư xin việc</h2>

                <Button variant='outline' asChild className='self-start'>
                  <Link to='/user/don-ung-tuyen'>Quay lại</Link>
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className='col-span-12'>
              <TextRenderer
                content={
                  appliedApplication?.jap_message || 'Không có Thư xin việc.'
                }
              />
            </CardContent>

            <CardFooter className='flex justify-end'>
              <Button
                type='submit'
                disabled={withdrawFetcher.state !== 'idle'}
                className='w-full sm:w-auto'
              >
                {withdrawFetcher.state !== 'idle' ? (
                  <>
                    <Loader2Icon className='animate-spin' />
                    <span className='ml-2'>Đang gửi...</span>
                  </>
                ) : (
                  'Thu hồi đơn ứng tuyển'
                )}
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data(
      {
        toast: {
          type: 'error',
          message: 'Vui lòng đăng nhập để thực hiện chức năng này.',
        },
      },
      { headers },
    );
  }

  try {
    const jobAppId = params.id;
    if (!jobAppId) {
      return data(
        {
          toast: {
            type: 'error',
            message: 'Không tìm thấy thông tin công việc.',
          },
        },
        { headers },
      );
    }

    // Call the service to withdraw the application
    const result = await withdrawJobApplication(jobAppId, session);

    return data(
      {
        toast: { type: 'success', message: result.message },
      },
      { headers },
    );
  } catch (error) {
    console.error('Error withdrawing job application:', error);
    return data(
      {
        toast: {
          type: 'error',
          message: 'Đã xảy ra lỗi khi thu hồi đơn ứng tuyển.',
        },
      },
      { headers },
    );
  }
};
