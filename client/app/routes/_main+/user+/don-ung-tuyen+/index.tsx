import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import Defer from '~/components/Defer';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import Pagination from '~/components/website/Pagination';
import { JOB_APPLICATION } from '~/constants/jobApplication.constant';
import { JOB_POST } from '~/constants/jobPost.constant';
import { parseAuthCookie } from '~/services/cookie.server';
import { listMyJobApplicationsAsCandidate } from '~/services/jobApplication.server';
import { formatCurrency, formatDate } from '~/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;
    const searchQuery = url.searchParams.get('search') || '';

    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder =
      (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    // Build a clean query object that matches the expected API format
    const query: any = {};

    // Search query - used for name, phone, email search
    if (searchQuery) {
      query.search = searchQuery;
    }
    // Pagination options
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const jobApplications = listMyJobApplicationsAsCandidate(
      query,
      options,
      auth,
    ).catch((error) => {
      console.error('Error fetching job applications:', error);
      return {
        success: false,
        message: 'Có lỗi khi tải danh sách đơn ứng tuyển',
      };
    });
    return { jobApplications };
  } catch (error) {
    console.error('Error loading job applications:', error);
    throw new Response('Error loading job applications', { status: 500 });
  }
};

export default function AppliedJobApplication() {
  const { jobApplications } = useLoaderData<typeof loader>();

  return (
    <div className='container py-8'>
      <div className='col-span-12'>
        <h1 className='text-2xl font-bold'>Danh sách đơn ứng tuyển</h1>
      </div>

      <div className='col-span-12 space-y-4 sm:space-y-6'>
        <Defer resolve={jobApplications}>
          {({ data: jobApps, pagination }) => {
            if (!jobApps || jobApps.length === 0) {
              return (
                <div className='text-center text-gray-500'>
                  <p>Không có đơn ứng tuyển nào.</p>
                </div>
              );
            }

            return (
              <>
                {jobApps.map((app) => {
                  const jobpost = app.jap_jobPost;

                  return (
                    <Card className='shadow-md hover:shadow-lg transition-all'>
                      <Link to={`/user/don-ung-tuyen/${app.id}`}>
                        <CardHeader className=''>
                          <CardTitle>
                            <h2 className='text-2xl text-main'>
                              {app.jap_jobPost.jpo_title}
                            </h2>
                          </CardTitle>
                          <Separator className='mt-2' />
                        </CardHeader>
                      </Link>

                      <CardContent>
                        <div className='col-span-12 lg:col-span-9 flex flex-col lg:flex-row gap-4 justify-between'>
                          <div className='flex gap-6'>
                            <div className='flex gap-2 items-center'>
                              <p className='text-xs'>Lương:</p>
                              <p className='font-bold'>
                                {formatCurrency(jobpost.jpo_salaryFrom || 0)} -{' '}
                                {formatCurrency(jobpost.jpo_salaryTo || 0)}
                              </p>
                            </div>

                            <div className='flex gap-2 items-center'>
                              <p className='text-xs'>Ứng tuyển ngày:</p>
                              <p className='font-bold'>
                                {formatDate(app.createdAt)}
                              </p>
                            </div>

                            <div className='flex gap-2 items-center'>
                              <p className='text-xs'>Trạng thái ứng tuyển:</p>
                              {STATUS_BADGE[app.jap_status]}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                <Pagination pagination={pagination} />
              </>
            );
          }}
        </Defer>
      </div>
    </div>
  );
}

const STATUS_BADGE = {
  [JOB_APPLICATION.STATUS.APPLIED.slug]: (
    <Badge className='bg-blue-500 text-white hover:bg-unset'>
      {JOB_APPLICATION.STATUS.APPLIED.name}
    </Badge>
  ),
  [JOB_APPLICATION.STATUS.SHORTLISTED.slug]: (
    <Badge className='bg-yellow-500 text-white hover:bg-unset'>
      {JOB_APPLICATION.STATUS.SHORTLISTED.name}
    </Badge>
  ),
  [JOB_APPLICATION.STATUS.INTERVIEW.slug]: (
    <Badge className='bg-purple-500 text-white hover:bg-unset'>
      {JOB_APPLICATION.STATUS.INTERVIEW.name}
    </Badge>
  ),
  [JOB_APPLICATION.STATUS.HIRED.slug]: (
    <Badge className='bg-emerald-600 text-white hover:bg-unset'>
      {JOB_APPLICATION.STATUS.HIRED.name}
    </Badge>
  ),
  [JOB_APPLICATION.STATUS.REJECTED.slug]: (
    <Badge className='bg-red-500 text-white hover:bg-unset'>
      {JOB_APPLICATION.STATUS.REJECTED.name}
    </Badge>
  ),
  [JOB_APPLICATION.STATUS.WITHDRAWN.slug]: (
    <Badge className='bg-gray-500 text-white hover:bg-unset'>
      {JOB_APPLICATION.STATUS.WITHDRAWN.name}
    </Badge>
  ),
};
