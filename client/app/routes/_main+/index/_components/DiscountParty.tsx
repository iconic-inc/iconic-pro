import MasterDetail from '~/components/website/MasterDetail';
import SectionTitle from '~/components/website/SectionTitle';

export default function DiscountParty() {
  return (
    <section
      id='promotion'
      className='bg-cover bg-top max-lg:pt-20 max-lg:pb-8'
      style={{
        backgroundImage: 'var(--bg-wave-mobile) !important',
      }}
    >
      <div className='container grid-cols-1'>
        <SectionTitle>ĐẠI TIỆC KHUYẾN MÃI</SectionTitle>

        <MasterDetail data={promotions} />
      </div>
    </section>
  );
}

const promotions = [
  {
    banner: '/images/promotions/dieu-tri-da.png',
    isHot: true,
    tab: 'tab_dieu-tri-da',
    details: {
      alt: 'Khuyến mãi Điều trị da',
      content: [
        {
          title: 'CẤY COLLAGEN TƯƠI',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'NÂNG MŨI',
          description: [
            'Ưu đãi 65% khi đăng ký liệu trình',
            'Tặng Voucher 1.000.000VNĐ',
          ],
        },
        {
          title: 'TRẺ HÓA DA',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
      ],
    },
  },
  {
    banner: '/images/promotions/phun-xam-dieu-khac.png',
    isHot: true,
    tab: 'tab_phun-xam-dieu-khac',
    details: {
      alt: 'Khuyến mãi Điều trị da',
      content: [
        {
          title: 'CẤY COLLAGEN TƯƠI',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'NÂNG MŨI',
          description: [
            'Ưu đãi 65% khi đăng ký liệu trình',
            'Tặng Voucher 1.000.000VNĐ',
          ],
        },
        {
          title: 'TRẺ HÓA DA',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'CẮT MÍ',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
      ],
    },
  },
  {
    banner: '/images/promotions/tre-hoa-da.png',
    isHot: true,
    tab: 'tab_tre-hoa-da',
    details: {
      alt: 'Khuyến mãi Điều trị da',
      content: [
        {
          title: 'CẤY COLLAGEN TƯƠI',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'NÂNG MŨI',
          description: [
            'Ưu đãi 65% khi đăng ký liệu trình',
            'Tặng Voucher 1.000.000VNĐ',
          ],
        },
        {
          title: 'TRẺ HÓA DA',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'CẮT MÍ',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
      ],
    },
  },
  {
    banner: '/images/promotions/cat-mi.png',
    isHot: true,
    tab: 'tab_cat-mi',
    details: {
      alt: 'Khuyến mãi Điều trị da',
      content: [
        {
          title: 'CẤY COLLAGEN TƯƠI',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'NÂNG MŨI',
          description: [
            'Ưu đãi 65% khi đăng ký liệu trình',
            'Tặng Voucher 1.000.000VNĐ',
          ],
        },
        {
          title: 'TRẺ HÓA DA',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'CẮT MÍ',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
      ],
    },
  },
  {
    banner: '/images/promotions/nang-mui.png',
    isHot: true,
    tab: 'tab_nang-mui',
    details: {
      alt: 'Khuyến mãi Điều trị da',
      content: [
        {
          title: 'CẤY COLLAGEN TƯƠI',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'NÂNG MŨI',
          description: [
            'Ưu đãi 65% khi đăng ký liệu trình',
            'Tặng Voucher 1.000.000VNĐ',
          ],
        },
        {
          title: 'TRẺ HÓA DA',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'CẮT MÍ',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
      ],
    },
  },
  {
    banner: '/images/promotions/nang-cung-chan-may.png',
    isHot: true,
    tab: 'tab_nang-cung-chan-may',
    details: {
      alt: 'Khuyến mãi Điều trị da',
      content: [
        {
          title: 'CẤY COLLAGEN TƯƠI',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'NÂNG MŨI',
          description: [
            'Ưu đãi 65% khi đăng ký liệu trình',
            'Tặng Voucher 1.000.000VNĐ',
          ],
        },
        {
          title: 'TRẺ HÓA DA',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
        {
          title: 'CẮT MÍ',
          description: ['Giảm 30% cho lần đầu tiên'],
        },
      ],
    },
  },
];
