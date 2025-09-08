import { IBranch } from '~/interfaces/branch.interface';
import { toAddressString } from '~/utils/address.util';

export default function MapDisplay({ branch }: { branch: IBranch }) {
  return (
    <div className='w-full'>
      <div className='relative w-full aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden shadow-lg'>
        <iframe
          src={branch.bra_map}
          width='100%'
          height='100%'
          className='absolute inset-0 w-full h-full'
          style={{ border: 0 }}
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          title={`Map of ${branch.bra_name}`}
        ></iframe>
      </div>
    </div>
  );
}
