import MasterDetail from '~/components/website/MasterDetail';
import SectionTitle from '~/components/website/SectionTitle';

export default function DiscountParty() {
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

        <MasterDetail data={promotions} />
      </div>
    </section>
  );
}

const promotions = [
  {
    banner: '/images/promotions/marketing.png',
    isHot: true,
    tab: 'tab-marketing',
    details: {
      alt: 'Khuyến mãi khóa học Marketing',
      content: `<div class="marketing-promo">
        <h3>Ưu đãi đặc biệt: Khóa học Marketing thực chiến</h3>
        <ul>
            <li>Với khóa học <span class="highlight">Marketing thực chiến</span> tại Iconic PRO, bạn sẽ được:</li>
            <li>✨ **Giảm giá 50% học phí**</li>
            <li>✨ Học cách xây dựng chiến lược marketing hiệu quả, thu hút khách hàng cho Spa.</li>
            <li>✨ Nắm vững kỹ năng truyền thông, tạo nội dung bán hàng độc đáo.</li>
            <li>✨ Biết cách giữ chân khách hàng dài lâu thông qua các chiến dịch thực tế, cá nhân hóa.</li>
        </ul>
        <p class="cta">Đây là cơ hội vàng để bứt phá doanh thu cho Spa của bạn, đừng bỏ lỡ!</p>
    </div>`,
    },
  },
  {
    banner: '/images/promotions/marketing.png',
    isHot: true,
    tab: 'tab-telesales',
    details: {
      alt: 'Khuyến mãi khóa học Telesales',
      content: `<div class="telesales-promo">
        <h3>Ưu đãi đặc biệt: Khóa học Telesales thực chiến</h3>
        <ul>
            <li>Với khóa học <span class="highlight">Telesales thực chiến</span> tại Iconic PRO, bạn sẽ được:</li>
            <li>✨ **Giảm giá 50% học phí**</li>
            <li>✨ Nắm vững kịch bản và kỹ thuật chốt sale qua điện thoại.</li>
            <li>✨ Học cách tạo sự kết nối và thuyết phục khách hàng hiệu quả.</li>
            <li>✨ Biến cuộc gọi thành doanh thu, từ học viên telesale đến khi khách hàng bước chân ra khỏi Spa.</li>
        </ul>
        <p class="cta">Tối ưu hóa khả năng chốt đơn và gia tăng doanh số ngay hôm nay!</p>
    </div>`,
    },
  },
  {
    banner: '/images/promotions/marketing.png',
    isHot: true,
    tab: 'tab-consulting',
    details: {
      alt: 'Khuyến mãi khóa học Tư vấn viên',
      content: `<div class="consulting-promo">
        <h3>Ưu đãi đặc biệt: Khóa học Tư vấn viên thực chiến</h3>
        <ul>
            <li>Với khóa học <span class="highlight">Tư vấn viên thực chiến</span> tại Iconic PRO, bạn sẽ được:</li>
            <li>✨ **Giảm giá 50% học phí**</li>
            <li>✨ Nắm vững tư duy giao tiếp chuyên nghiệp, thuyết phục khách hàng.</li>
            <li>✨ Học cách đọc vị tâm lý khách hàng và đưa ra giải pháp phù hợp nhất.</li>
            <li>✨ Biến kỹ năng tư vấn thành lợi thế cạnh tranh, chốt đơn hiệu quả và xây dựng niềm tin bền vững.</li>
        </ul>
        <p class="cta">Nâng tầm kỹ năng tư vấn, chinh phục mọi khách hàng khó tính!</p>
    </div>`,
    },
  },
  {
    banner: '/images/promotions/marketing.png',
    isHot: true,
    tab: 'tab-manager',
    details: {
      alt: 'Khuyến mãi khóa học Quản lý Spa',
      content: ` <div class="spa-management-promo">
        <h3>Ưu đãi đặc biệt: Khóa học Quản lý Spa thực chiến</h3>
        <ul>
            <li>Với khóa học <span class="highlight">Quản lý Spa thực chiến</span> tại Iconic PRO, bạn sẽ được:</li>
            <li>✨ **Giảm giá 50% học phí**</li>
            <li>✨ Học cách thiết lập hệ thống, phân chia công việc tối ưu trong Spa.</li>
            <li>✨ Nắm vững kỹ năng tuyển dụng và quản lý nhân sự hiệu quả.</li>
            <li>✨ Xây dựng một quy trình vận hành trơn tru, giúp Spa phát triển bền vững và tăng lợi nhuận.</li>
        </ul>
        <p class="cta">Trở thành nhà quản lý Spa chuyên nghiệp, dẫn dắt đội ngũ đến thành công!</p>
    </div>`,
    },
  },
];
