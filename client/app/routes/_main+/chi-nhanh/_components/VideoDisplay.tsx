import { IBranch } from '~/interfaces/branch.interface';

export default function VideoDisplay({ branch }: { branch: IBranch }) {
  return (
    <div className='w-full aspect-video rounded-lg overflow-hidden shadow-lg'>
      <iframe
        width='100%'
        height='100%'
        src={'https://www.youtube.com/embed/yQQUmAgZty4'}
        title={`Video ${branch.bra_name}`}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        className='w-full h-full'
      />
    </div>
  );
}
