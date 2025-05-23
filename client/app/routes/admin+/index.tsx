import { LoaderFunctionArgs } from '@remix-run/node';
import DashContentHeader from '~/components/DashContentHeader';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    return {};
  } catch (error) {
    console.error(error);

    return {};
  }
};

export default function IndexAdmin() {
  return (
    <>
      {/* Content Header */}
      <DashContentHeader title='Trang chủ' />
      {/* Main Dashboard Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'></div>
    </>
  );
}
