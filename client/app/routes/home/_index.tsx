import { useFetcher } from '@remix-run/react';
import './index.css';
import { useEffect, useState } from 'react';
import { action } from '../api+/courses+/register';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Home() {
  function openPopup() {
    document.getElementById('registration-popup')!.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closePopup() {
    document.getElementById('registration-popup')!.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  const fetcher = useFetcher<typeof action>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('marketing');

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!name || !phone || !course) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    fetcher.submit(
      {
        name,
        phone,
        course,
      },
      {
        method: 'POST',
        action: '/api/courses/register',
      },
    );
  }

  useEffect(() => {
    if (fetcher.data) {
      const { success, message } = fetcher.data;
      if (success) {
        alert(message || 'Đăng ký thành công!');
        setName('');
        setPhone('');
        setCourse('');
      } else if (message) {
        alert(message);
      }

      closePopup();
    }
  }, [fetcher.data]);

  return (
    <>
      <header className='content-container flex justify-end items-center p-4 bg-[#171010] space-x-4'>
        <div className='flex items-center space-x-2 text-white'>
          <span className='text-sm'>CEO: </span>
          <span className='text-base font-bold'>Mr Phạm Văn Thanh</span>
        </div>

        <span>
          Hotline:
          <a
            href='tel:0908573102'
            target='_blank'
            rel='noopener noreferrer'
            className='ml-1 hover:underline'
          >
            0908 573 102
          </a>
        </span>
      </header>

      <div className='grid grid-cols-1 gap-y-12 px-4'>
        <section className='content-container grid grid-cols-1'>
          <section className='grid grid-cols-1'>
            <div className='flex flex-col flex-wrap items-center'>
              <div className='h-[300px] w-full py-2.5 overflow-hidden flex items-center'>
                <img
                  className='object-cover'
                  src='/images/logo.png'
                  alt='logo'
                />
              </div>

              <div className='py-2.5'>
                <p className='hook'>
                  <span>Bạn đang sở hữu một spa…</span>
                  Nhưng mỗi ngày lại
                  <b>trống lịch, vắng khách?</b>
                </p>

                <p className='hook'>
                  <span>Bạn đã đầu tư cơ sở, máy móc, sản phẩm…</span>
                  Nhưng doanh thu vẫn
                  <b>chưa như mong đợi?</b>
                </p>

                <p className='hook'>
                  <span>Đội ngũ thì rời rạc…</span>
                  Telesale
                  <b>không biết chốt đơn, Tư vấn viên không giữ được khách…</b>
                </p>

                <p className='hook'>
                  <span>Bạn đã thử quảng cáo, giảm giá, livestream…</span>
                  Nhưng mọi thứ vẫn…
                  <b>giậm chân tại chỗ?</b>
                </p>
              </div>

              <div className='py-4'>
                <h3 className='text-[--yellow] text-4xl font-bold text-center'>
                  ICONIC PRO
                </h3>

                <p className='hook'>
                  <span>
                    HỌC VIỆN KỸ NĂNG ĐƯỢC SINH RA ĐỂ GIẢI QUYẾT BÀI TOÁN DOANH
                    THU CỦA NGÀNH LÀM ĐẸP
                  </span>
                </p>
              </div>

              <div className='pb-[50px]'>
                <button className='btn' onClick={openPopup}>
                  <div className='flex items-center justify-center gap-4'>
                    <span className=''> Đăng ký Ngay hôm nay chỉ còn </span>
                    <div className='flex flex-col'>
                      <span className='text-yellow font-bold text-2xl text-[--yellow-light]'>
                        499.000 đ
                      </span>
                      <span className='text-gray-400 line-through text-sm'>
                        2.500.000 đ
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <section className='declaration w-full flex flex-col items-center'>
            {/* <div className='declaration-speaker'>
              <div
                className='w-[300px]'
                style={{
                  backgroundImage: "url('/images/dot-dot.png')",
                  backgroundPosition: '-55px 80px',
                  marginInline: '-10px',
                }}
              >
                <img
                  src='/images/speaker-2.png'
                  alt='speaker'
                  className='object-contain'
                  style={{
                    marginTop: '-44px',
                    marginInline: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div> */}

            <div className='flex flex-col justify-center px-4'>
              <h2 className='heading-title text-center text-2xl mt-4'>
                Tại đây, bạn được đào tạo bài bản
              </h2>

              <div className='declaration-quote'>
                <p>
                  <strong>Khoá Marketing thực chiến</strong> – Chạy quảng cáo
                  hiệu quả, thu hút thêm nhiều khách hàng hàng tiềm năng, học
                  viên cho cơ sở của bạn
                </p>

                <p>
                  <strong>Khoá Telesale thực chiến</strong> – Gọi điện đặt lịch
                  cho khách, chuyển đổi khách đến chi nhánh, giảm tỷ lệ huỷ hẹn
                </p>

                <p>
                  <strong>Khoá Tư vấn viên thực chiến</strong> – Chốt khách lên
                  liệu trình, bill cao tối ưu doanh thu
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className='prospect content-container row-span-1'>
          <div className='d-flex flex-column'>
            <h2 className='heading-title text-center text-2xl'>
              khóa học DÀNH CHO AI?
            </h2>

            <div className='grid grid-cols-1 gap-y-3 my-10'>
              <div className='col-span-1'>
                <div className='tag'>
                  <div className='icon'>
                    <svg
                      fill='var(--secondary-color)'
                      height='80px'
                      width='80px'
                      version='1.1'
                      id='Capa_1'
                      xmlns='http://www.w3.org/2000/svg'
                      xmlnsXlink='http://www.w3.org/1999/xlink'
                      viewBox='0 0 247.065 247.065'
                      xmlSpace='preserve'
                    >
                      <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                      <g
                        id='SVGRepo_tracerCarrier'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      ></g>
                      <g id='SVGRepo_iconCarrier'>
                        <g>
                          <path d='M160.551,36.935c-0.614-1.892-1.956-3.462-3.727-4.365c-1.774-0.904-3.831-1.065-5.724-0.45l-31.376,10.196 c-3.939,1.28-6.096,5.511-4.815,9.45l1.568,4.828l-79.811,58.625L5.183,125.448c-1.892,0.615-3.462,1.956-4.365,3.728 c-0.903,1.772-1.065,3.831-0.45,5.723l19.129,58.862c1.03,3.169,3.97,5.184,7.131,5.184c0.769,0,1.55-0.119,2.32-0.369 l31.478-10.229l16.173,0.085c3.248,15.336,16.888,26.88,33.176,26.88c16.164,0,29.714-11.371,33.095-26.531l16.587,0.087 l1.568,4.829c0.614,1.892,1.955,3.462,3.728,4.365c1.064,0.542,2.232,0.817,3.405,0.817c0.78,0,1.563-0.122,2.317-0.367 l31.377-10.195c3.939-1.28,6.096-5.511,4.816-9.45L160.551,36.935z M31.444,181.992l-14.492-44.597l18.364-5.967l14.49,44.597 L31.444,181.992z M109.774,200.312c-7.912,0-14.694-4.887-17.513-11.797l34.958,0.184 C124.356,195.514,117.617,200.312,109.774,200.312z M64.714,173.369l-7.888-24.277l-7.888-24.277l72.419-53.194l22.209,68.349 l11.006,33.873L64.714,173.369z M172.972,181.929l-0.921-2.833c-0.001-0.005-0.002-0.011-0.004-0.017l-19.815-60.983l-20.74-63.833 l17.111-5.561l41.48,127.665L172.972,181.929z'></path>
                          <path d='M185.807,73.393c1.092,0.556,2.254,0.819,3.4,0.819c2.73,0,5.363-1.496,6.688-4.096l13.461-26.41 c1.882-3.69,0.415-8.207-3.275-10.088c-3.69-1.88-8.207-0.415-10.088,3.276l-13.461,26.41 C180.65,66.995,182.117,71.512,185.807,73.393z'></path>
                          <path d='M242.176,144.712l-26.414-13.455c-3.691-1.879-8.207-0.412-10.087,3.279c-1.881,3.691-0.412,8.207,3.278,10.087 l26.414,13.455c1.091,0.555,2.253,0.818,3.398,0.818c2.73,0,5.364-1.497,6.689-4.097 C247.335,151.109,245.867,146.593,242.176,144.712z'></path>
                          <path d='M204.242,101.204c1.03,3.169,3.97,5.184,7.131,5.184c0.769,0,1.55-0.119,2.32-0.369l28.188-9.16 c3.938-1.28,6.095-5.511,4.814-9.451c-1.28-3.94-5.511-6.092-9.451-4.815l-28.188,9.16 C205.118,93.034,202.962,97.265,204.242,101.204z'></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <h3 className='title'>Marketing</h3>
                  <span className='content'>
                    Dành cho Chủ Spa, Người nhà học chạy ads, Học viên mới muốn
                    vào nghề Marketing spa
                  </span>
                </div>
              </div>

              <div className='col-span-1'>
                <div className='tag'>
                  <div className='icon h-16 w-16'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 512 512'
                      fill='var(--secondary-color)'
                    >
                      <path d='M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z' />
                    </svg>
                  </div>
                  <h3 className='title'>TELESALE</h3>
                  <span className='content'>
                    Dành cho Chủ Spa, nhân sự CSKH/Telesale tại spa, Học viên
                    chưa tự tin nói chuyện với khách hàng
                  </span>
                </div>
              </div>

              <div className='col-span-1'>
                <div className='tag'>
                  <div className='icon h-16 w-16'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 512 512'
                    >
                      <path d='M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z' />
                    </svg>
                  </div>
                  <h3 className='title'>Tư vấn viên</h3>
                  <span className='content'>
                    Dành cho Chủ Spa, Nhân viên tư vấn tại spa, Thẩm mỹ viện,
                    Người mới vào nghề nhưng muốn chốt đơn bài bản
                  </span>
                </div>
              </div>
            </div>

            <button className='btn' onClick={openPopup}>
              <div className='flex items-center justify-center gap-4'>
                <span className=''> Đăng ký Ngay hôm nay chỉ còn </span>
                <div className='flex flex-col'>
                  <span className='text-yellow font-bold text-2xl text-[--yellow-light]'>
                    499.000 đ
                  </span>
                  <span className='text-gray-400 line-through text-sm'>
                    2.500.000 đ
                  </span>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className='pros bg-[--secondary-color]'>
          <div className='wave mb-5'>
            <img
              className='rotate-180 w-full h-16'
              src='/svg/wave-1.svg'
              alt='wave'
            />
          </div>

          <div className="bg-[url('/images/wave-1.png')] bg-no-repeat bg-cover">
            <div className='content-container px-4'>
              <h2 className='heading-title text-4xl text-center mb-2 text-[--yellow-light]'>
                ICONIC PRO
              </h2>
              <h3 className='text-center'>
                HỌC VIỆN KỸ NĂNG ĐƯỢC SINH RA ĐỂ GIẢI QUYẾT BÀI TOÁN DOANH THU
                CỦA NGÀNH LÀM ĐẸP
              </h3>

              <div className='content py-8'>
                <div className='content flex flex-col justify-center text-lg'>
                  <p className='my-2'>
                    Học là
                    <strong>
                      {' '}
                      <span>áp dụng liền</span>
                    </strong>
                    – tại lớp hoặc ngay tại spa của bạn
                  </p>

                  <p className='my-2'>
                    Cam kết thấy kết quả rõ rệt chỉ
                    <strong>sau 7 đến 14 ngày</strong> nếu học đủ – làm đúng
                  </p>

                  <p className='my-2'>
                    <strong>ICONIC PRO</strong> – Không chỉ là nơi đào tạo, Mà
                    là người bạn đồng hành giúp bạn chạm
                    <strong>cột mốc doanh thu mới</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='requirement'>
          <div className='content-container space-y-10'>
            <div>
              <h2 className='heading-title'>Cho dù bạn</h2>

              <div className='content'>
                <ul>
                  <li>
                    <p>
                      Không có kinh nghiệm hoặc đã thất bại về marketing,
                      content hay làm thương hiệu.
                    </p>
                  </li>
                  <li>
                    <p>
                      Mới chỉ quan tâm nhưng chưa có hiểu biết nhiều về insight,
                      trải nghiệm khách hàng.
                    </p>
                  </li>
                  <li>
                    <p>
                      Không có kinh nghiệm trong việc xây dựng văn hóa doanh
                      nghiệp.
                    </p>
                  </li>
                  <li>
                    <p>
                      Không có đội ngũ nhân viên ưng ý, thiếu bộ phận Marketing.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className='heading-title mb-2'>Bạn không cần phải</h2>

              <div className='content'>
                <ul>
                  <li>
                    <p>
                      Vất vả, vật vã, thử sai nhiều năm trời, vừa điều hành vừa
                      học thêm cái mới và trở thành “chuột bạch” cho những chiến
                      lược chưa được kiểm chứng.
                    </p>
                  </li>
                  <li>
                    <p>
                      Bỏ ra hàng trăm giờ học hàng nghìn tài liệu về thương
                      hiệu, marketing, content hay trải nghiệm khách hàng phức
                      tạp và lạc lối trong biển thông tin đó.
                    </p>
                  </li>
                  <li>
                    <p>
                      Thay đổi mô hình kinh doanh và lõi giá trị của bạn hiện
                      tại để không nhận ra bản thân.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className='my-5'>
              <button className='btn' onClick={openPopup}>
                <div className='flex items-center justify-center gap-4'>
                  <span className=''> Đăng ký Ngay hôm nay chỉ còn </span>
                  <div className='flex flex-col'>
                    <span className='text-yellow font-bold text-2xl text-[--yellow-light]'>
                      499.000 đ
                    </span>
                    <span className='text-gray-400 line-through text-sm'>
                      2.500.000 đ
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className='commitment'>
          <div>
            <div className='content-container'>
              <h2 className='heading-title text-4xl text-center'>
                Bạn sẽ học được gì từ những khoá học này?
              </h2>

              <div className='content my-12'>
                <div className=''>
                  <div className='grid grid-cols-1 gap-y-10'>
                    <div className='widget'>
                      <div className='icon'>
                        <svg
                          fill='#fff'
                          height='34px'
                          width='34px'
                          version='1.1'
                          id='Capa_1'
                          xmlns='http://www.w3.org/2000/svg'
                          xmlnsXlink='http://www.w3.org/1999/xlink'
                          viewBox='0 0 247.065 247.065'
                          xmlSpace='preserve'
                        >
                          <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                          <g
                            id='SVGRepo_tracerCarrier'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          ></g>
                          <g id='SVGRepo_iconCarrier'>
                            <g>
                              <path d='M160.551,36.935c-0.614-1.892-1.956-3.462-3.727-4.365c-1.774-0.904-3.831-1.065-5.724-0.45l-31.376,10.196 c-3.939,1.28-6.096,5.511-4.815,9.45l1.568,4.828l-79.811,58.625L5.183,125.448c-1.892,0.615-3.462,1.956-4.365,3.728 c-0.903,1.772-1.065,3.831-0.45,5.723l19.129,58.862c1.03,3.169,3.97,5.184,7.131,5.184c0.769,0,1.55-0.119,2.32-0.369 l31.478-10.229l16.173,0.085c3.248,15.336,16.888,26.88,33.176,26.88c16.164,0,29.714-11.371,33.095-26.531l16.587,0.087 l1.568,4.829c0.614,1.892,1.955,3.462,3.728,4.365c1.064,0.542,2.232,0.817,3.405,0.817c0.78,0,1.563-0.122,2.317-0.367 l31.377-10.195c3.939-1.28,6.096-5.511,4.816-9.45L160.551,36.935z M31.444,181.992l-14.492-44.597l18.364-5.967l14.49,44.597 L31.444,181.992z M109.774,200.312c-7.912,0-14.694-4.887-17.513-11.797l34.958,0.184 C124.356,195.514,117.617,200.312,109.774,200.312z M64.714,173.369l-7.888-24.277l-7.888-24.277l72.419-53.194l22.209,68.349 l11.006,33.873L64.714,173.369z M172.972,181.929l-0.921-2.833c-0.001-0.005-0.002-0.011-0.004-0.017l-19.815-60.983l-20.74-63.833 l17.111-5.561l41.48,127.665L172.972,181.929z'></path>
                              <path d='M185.807,73.393c1.092,0.556,2.254,0.819,3.4,0.819c2.73,0,5.363-1.496,6.688-4.096l13.461-26.41 c1.882-3.69,0.415-8.207-3.275-10.088c-3.69-1.88-8.207-0.415-10.088,3.276l-13.461,26.41 C180.65,66.995,182.117,71.512,185.807,73.393z'></path>
                              <path d='M242.176,144.712l-26.414-13.455c-3.691-1.879-8.207-0.412-10.087,3.279c-1.881,3.691-0.412,8.207,3.278,10.087 l26.414,13.455c1.091,0.555,2.253,0.818,3.398,0.818c2.73,0,5.364-1.497,6.689-4.097 C247.335,151.109,245.867,146.593,242.176,144.712z'></path>
                              <path d='M204.242,101.204c1.03,3.169,3.97,5.184,7.131,5.184c0.769,0,1.55-0.119,2.32-0.369l28.188-9.16 c3.938-1.28,6.095-5.511,4.814-9.451c-1.28-3.94-5.511-6.092-9.451-4.815l-28.188,9.16 C205.118,93.034,202.962,97.265,204.242,101.204z'></path>
                            </g>
                          </g>
                        </svg>
                      </div>

                      <h3 className='uppercase text-2xl font-bold mt-2 mb-4'>
                        KHÓA HỌC THỰC CHIẾN MARKETING
                      </h3>

                      <div>
                        <ul>
                          <li>
                            <p>
                              Nắm vững cách
                              <strong>
                                nghiên cứu chân dung khách hàng
                              </strong>{' '}
                              và
                              <strong>hành vi tiêu dùng</strong> trong ngành làm
                              đẹp.
                            </p>
                          </li>
                          <li>
                            <p>
                              Xây dựng
                              <strong>kịch bản nội dung</strong> (content) theo
                              từng giai đoạn <strong>phễu</strong>:
                              <strong>thu hút</strong> –
                              <strong>chuyển đổi</strong> –
                              <strong>giữ chân</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Thực hành tạo <strong>bài viết quảng cáo</strong>,
                              <strong>video reels</strong>,
                              <strong>story viral</strong> phù hợp với nền tảng
                              (<strong>Facebook</strong>,<strong>TikTok</strong>
                              ).
                            </p>
                          </li>
                          <li>
                            <p>
                              Thiết lập
                              <strong>chiến dịch quảng cáo chuyển đổi</strong>
                              trên nền tảng <strong>Facebook Ads</strong> –
                              <strong>tối ưu chi phí</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Hiểu và ứng dụng
                              <strong>chiến lược thương hiệu cá nhân</strong>
                              trong ngành làm đẹp để
                              <strong>tăng niềm tin</strong> từ khách hàng.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className='widget'>
                      <div className='icon'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 512 512'
                          fill='#fff'
                          height='30px'
                          width='30px'
                        >
                          <path d='M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z' />
                        </svg>
                      </div>

                      <h3 className='uppercase text-2xl font-bold mt-2 mb-4'>
                        KHÓA HỌC THỰC CHIẾN TELESALES
                      </h3>

                      <div>
                        <ul>
                          <li>
                            <p>
                              Soạn thảo và luyện tập
                              <strong>kịch bản gọi điện</strong> theo từng loại
                              khách: <strong>khách mới</strong> –
                              <strong>khách cũ</strong> –
                              <strong>khách không phản hồi</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Biết cách <strong>đặt câu hỏi mở</strong> –
                              <strong>khai thác nhu cầu</strong> –
                              <strong>gợi mở mong muốn mua hàng</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              <strong>Kỹ thuật xử lý từ chối</strong>: "chị đang
                              bận", "chị tham khảo thêm", "chị chưa có nhu
                              cầu"... một cách <strong>thông minh</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Tư duy gọi khách <strong>không bán hàng</strong> –
                              mà <strong>kết nối</strong> –
                              <strong>trao giá trị</strong> –
                              <strong>tạo mối quan hệ lâu dài</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Biến <strong>khách cũ</strong> thành
                              <strong>nguồn doanh thu lặp lại</strong> bằng
                              <strong>kịch bản chăm sóc sau bán</strong>.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className='widget'>
                      <div className='icon'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 512 512'
                          fill='#fff'
                          height='30px'
                          width='30px'
                        >
                          <path d='M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z' />
                        </svg>
                      </div>

                      <h3 className='uppercase text-2xl font-bold mt-2 mb-4'>
                        KHÓA HỌC THỰC CHIẾN TƯ VẤN VIÊN
                      </h3>

                      <div>
                        <ul>
                          <li>
                            <p>
                              Đào tạo
                              <strong>kỹ năng giao tiếp chuyên nghiệp</strong>,
                              biết <strong>quan sát</strong>,
                              <strong>lắng nghe</strong> và
                              <strong>hiểu tâm lý khách</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Rèn luyện <strong>phong thái tư vấn</strong>:
                              <strong>ánh mắt</strong> –
                              <strong>giọng nói</strong> –
                              <strong>ngôn ngữ cơ thể</strong> –
                              <strong>cách đặt vấn đề</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Biết cách kết hợp
                              <strong>kiến thức kỹ thuật</strong> và
                              <strong>kỹ năng bán hàng</strong> để không bị
                              <strong>"chốt ép"</strong> mà vẫn
                              <strong>đạt chỉ tiêu</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              <strong>Tư duy dịch vụ</strong>: không chỉ
                              <strong>chăm sóc</strong> mà
                              <strong>tạo trải nghiệm tốt</strong> giúp khách
                              <strong>giới thiệu</strong> và
                              <strong>quay lại</strong>.
                            </p>
                          </li>
                          <li>
                            <p>
                              Xây dựng <strong>kế hoạch bán hàng</strong> và
                              <strong>tăng tỉ lệ bán liệu trình cao</strong> dựa
                              trên <strong>phân tích hành vi & nhu cầu</strong>.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button className='btn' onClick={openPopup}>
                <div className='flex items-center justify-center gap-4'>
                  <span className=''> Đăng ký Ngay hôm nay chỉ còn </span>
                  <div className='flex flex-col'>
                    <span className='text-yellow font-bold text-2xl text-[--yellow-light]'>
                      499.000 đ
                    </span>
                    <span className='text-gray-400 line-through text-sm'>
                      2.500.000 đ
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* <!-- Registration Popup --> */}
        <div
          id='registration-popup'
          className='fixed inset-0 z-50 hidden overflow-auto bg-black bg-opacity-50 flex items-center justify-center'
          onClick={closePopup}
        >
          <div
            className='bg-white rounded-lg shadow-lg max-w-md w-full mx-4 md:mx-auto relative'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={closePopup}
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            <div className='p-6'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl text-[--yellow] font-bold uppercase'>
                  Đăng Ký Khóa Học
                </h3>
                <p className='text-gray-600 mt-1'>
                  Điền thông tin để nhận tư vấn miễn phí
                </p>
              </div>

              <fetcher.Form
                id='registration-form'
                className='space-y-4 text-gray-700'
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Họ và tên <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                    placeholder='Nhập họ và tên của bạn'
                  />
                </div>

                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Số điện thoại <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                    placeholder='Nhập số điện thoại của bạn'
                  />
                  {phone === '' ||
                  /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phone) ? null : (
                    <p className='text-red-500 text-xs mt-1'>
                      Số điện thoại không hợp lệ. Vui lòng nhập lại.
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Khóa học bạn quan tâm{' '}
                    <span className='text-red-500'>*</span>
                  </label>
                  <div className='space-y-2'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        id='course-marketing'
                        name='course'
                        value='marketing'
                        checked={course === 'marketing'}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                        className='h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300'
                      />
                      <label
                        htmlFor='course-marketing'
                        className='ml-2 block text-sm text-gray-700'
                      >
                        Khóa Học Thực Chiến Marketing
                      </label>
                    </div>

                    <div className='flex items-center'>
                      <input
                        type='radio'
                        id='course-telesales'
                        name='course'
                        value='telesales'
                        checked={course === 'telesales'}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                        className='h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300'
                      />
                      <label
                        htmlFor='course-telesales'
                        className='ml-2 block text-sm text-gray-700'
                      >
                        Khóa Học Thực Chiến Telesales
                      </label>
                    </div>

                    <div className='flex items-center'>
                      <input
                        type='radio'
                        id='course-consultant'
                        name='course'
                        value='consultant'
                        checked={course === 'consultant'}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                        className='h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300'
                      />
                      <label
                        htmlFor='course-consultant'
                        className='ml-2 block text-sm text-gray-700'
                      >
                        Khóa Học Thực Chiến Tư Vấn Viên
                      </label>
                    </div>
                  </div>
                </div>

                <div className='pt-2'>
                  <button
                    type='submit'
                    className='w-full bg-[--secondary-color] text-white font-bold py-2.5 px-4 rounded-md transition duration-300 uppercase'
                  >
                    Đăng Ký Ngay
                  </button>
                </div>
              </fetcher.Form>

              <p className='text-xs text-gray-500 mt-4 text-center'>
                Bằng việc đăng ký, bạn đồng ý nhận thông tin tư vấn từ chúng tôi
              </p>
            </div>
          </div>
        </div>

        <footer>
          <div className='content-container flex flex-col flex-wrap items-center'>
            <div className='py-2.5 w-full h-[300px] overflow-hidden flex items-center'>
              <img
                className='block object-cover'
                src='/images/logo.png'
                alt='logo'
              />
            </div>

            <hr className='w-full border-secondary' />

            <div className='contacts flex flex-col gap-6 py-4 justify-around w-full'>
              <a
                href='https://www.facebook.com/profile.php?id=61571492766019'
                target='_blank'
                className='flex flex-col items-center justify-center gap-2'
              >
                <span className='icon'>
                  <Facebook />
                </span>
                <span className='content'>
                  Fanpage:{' '}
                  <span className='text-[--yellow-light]'>
                    Iconic PRO Academy
                  </span>
                </span>
              </a>

              <a
                href='tel:0908573102'
                target='_blank'
                className='flex flex-col items-center justify-center gap-2'
              >
                <span className='icon'>
                  <Phone />
                </span>
                <span className='text-[--yellow-light]'>0908 573 102</span>
              </a>

              <a
                className='flex flex-col items-center justify-center gap-2'
                href='https://maps.app.goo.gl/JTSdUGPBPenVByZ2A'
                target='_blank'
              >
                <span className='icon'>
                  <MapPin />
                </span>
                <span className='text-center'>
                  Số 15 Đường số 11, KDC Him Lam, Phường Tân Hưng, Quận 7,
                  TP.HCM
                </span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
