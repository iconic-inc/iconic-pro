import { CalendarClock, Headset, MapPin, PhoneCall } from 'lucide-react';
import { Link, useLocation } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { useMainLoaderData } from '~/lib/useMainLoaderData';
import Defer from '~/components/Defer';

export default function CTAMenu() {
  const { mainBranch } = useMainLoaderData();
  const location = useLocation();
  const isOnMainPage = location.pathname === '/';

  return (
    <div className='fixed bottom-0 w-[430px] bg-white z-50 border-t-2 border-red-500'>
      <div className='mx-auto flex justify-around items-center h-16'>
        <Defer resolve={mainBranch} fallback={<PhoneCall className='inline' />}>
          {(branch) => (
            <Button
              className='flex-1 text-main flex flex-col px-2 font-bold text-xs [&_svg]:size-6'
              asChild
            >
              <Link to={`tel:${branch?.bra_msisdn}`}>
                <PhoneCall className='inline' />
                Gọi điện
              </Link>
            </Button>
          )}
        </Defer>

        <Button
          className='flex-1 text-main flex flex-col px-2 font-bold text-xs [&_svg]:size-6'
          onClick={() => {
            if (
              typeof window !== 'undefined' &&
              (window as any).openRegistrationPopup
            ) {
              (window as any).openRegistrationPopup();
            }
          }}
        >
          <CalendarClock />
          Đặt lịch
        </Button>

        <Button
          className='flex-1 h-fit text-white flex flex-col px-2 font-bold text-xs [&_svg]:size-6 -translate-y-6'
          onClick={() => {
            if (
              typeof window !== 'undefined' &&
              (window as any).openRegistrationPopup
            ) {
              (window as any).openRegistrationPopup();
            }
          }}
        >
          <div className='bg-main rounded-full p-5 border-2 border-white'>
            <Headset />
          </div>
          <span className='bg-main rounded-full px-2 py-1 text-xs'>
            Tư vấn ngay
          </span>
        </Button>

        <Button
          className='flex-1 text-main flex flex-col px-2 font-bold text-xs [&_svg]:size-6'
          asChild
        >
          <Link to='/chi-nhanh'>
            <MapPin />
            Chi nhánh
          </Link>
        </Button>

        <Button
          className='flex-1 text-main flex flex-col px-2 font-bold text-xs'
          asChild
        >
          <Link to={isOnMainPage ? '#promotion' : '/#promotion'}>
            <div className='w-6 h-6'>
              <img src='/images/gift.png' alt='Khuyến mãi' />
            </div>
            Khuyến mãi
          </Link>
        </Button>
      </div>
    </div>
  );
}
