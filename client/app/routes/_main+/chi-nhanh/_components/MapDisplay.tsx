import { IBranch } from '~/interfaces/branch.interface';

export default function MapDisplay({ branch }: { branch: IBranch }) {
  return (
    <div className='w-full'>
      <iframe
        src={branch.bra_map}
        width={'100%'}
        height='720'
        style={{ border: 0 }}
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      ></iframe>
    </div>
  );
}
