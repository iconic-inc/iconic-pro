import MasterDetail from '~/components/website/MasterDetail';
import SectionTitle from '~/components/website/SectionTitle';
import { IImage } from '~/interfaces/image.interface';

export default function DiscountParty({
  discountImages,
}: {
  discountImages: IImage[];
}) {
  return (
    <section
      id='promotion'
      className='bg-cover bg-top pt-20 pb-8'
      style={{
        backgroundImage: 'var(--bg-wave-mobile) !important',
      }}
    >
      <div className='container grid-cols-1'>
        <SectionTitle>ĐẠI TIỆC KHUYẾN MÃI</SectionTitle>

        <MasterDetail data={discountImages} />
      </div>
    </section>
  );
}
