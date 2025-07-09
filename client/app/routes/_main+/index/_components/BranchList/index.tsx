import BranchCards from './BranchCards';
import SectionTitle from '~/components/website/SectionTitle';

export default function BranchList() {
  return (
    <section id='branch' className=''>
      <div className='container block'>
        <SectionTitle>CHI NHÁNH</SectionTitle>

        <BranchCards branches={branches} value={'ho-chi-minh'} />
      </div>
    </section>
  );
}

const branches = [
  {
    value: 'ho-chi-minh',
    province: 'Hồ Chí Minh',
    addresses: [
      {
        address: '71 Bùi Tá Hán, Phường An Phú',
        district: 'Thành phố Thủ Đức',
        map: 'https://goo.gl/maps/1',
        image: '/images/locations/71-bui-ta-han.png',
      },
    ],
  },
];
