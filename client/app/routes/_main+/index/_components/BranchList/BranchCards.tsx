import { MapPin } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';

export default function BranchCards({
  branches,
  value,
}: {
  branches: Array<{
    province: string;
    value: string;
    addresses: Array<{
      address: string;
      district: string;
      map: string;
      image: string;
      isHighlight?: boolean;
    }>;
  }>;
  value: string;
}) {
  const selectedBranch = branches.find((b) => b.value === value);

  return (
    <ScrollArea>
      <div className='grid-cols-10 gap-x-5 gap-y-8 flex flex-nowrap py-8 px-4'>
        {selectedBranch?.addresses.map((address, i) => (
          <InfoCard
            key={i}
            className='col-span-2 w-[220px]'
            image={address.image}
            isHighlight={address.isHighlight}
            button='Đặt lịch hẹn'
          >
            <p
              className='text-base mt-4 font-bold'
              style={{ color: 'rgb(var(--main-color))' }}
            >
              {address.address}
            </p>

            <p className='text-sm my-2'>{address.district}</p>

            <a
              className='text-xs font-bold underline flex justify-center'
              href={address.map}
              style={{ color: 'rgb(var(--main-color))' }}
              target='_blank'
            >
              <MapPin className='mr-1' size={12} />
              Nhấn xem chỉ đường
            </a>
          </InfoCard>
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
