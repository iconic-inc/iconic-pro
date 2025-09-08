import { MapPin } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';
import { IBranch } from '~/interfaces/branch.interface';
import { getProvinceBySlug, toAddressString } from '~/utils/address.util';

export default function BranchCards({
  branches,
}: {
  branches: Array<IBranch>;
}) {
  return (
    <ScrollArea>
      <div className='grid-cols-10 gap-x-5 gap-y-8 flex flex-nowrap py-8 px-4'>
        {branches.map((branch, i) => (
          <InfoCard
            key={i}
            className='col-span-2 w-[250px]'
            image={branch.bra_thumbnail.img_url}
            isHighlight={branch.bra_isMain}
            button='Đặt lịch hẹn'
            imgRatio='aspect-square'
          >
            <p
              className='text-base mt-4 font-bold'
              style={{ color: 'rgb(var(--main-color))' }}
            >
              {toAddressString(branch.bra_address)}
            </p>

            <p className='text-sm my-2'>
              {getProvinceBySlug(branch.bra_address.province)?.name}
            </p>

            <a
              className='text-xs font-bold underline flex justify-center'
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(toAddressString(branch.bra_address))}`}
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
