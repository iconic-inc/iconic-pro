import { useLoaderData } from '@remix-run/react';
import Defer from '~/components/Defer';
import SectionTitle from '~/components/website/SectionTitle';
import TextRenderer from '~/components/website/TextRenderer';
import { getPage } from '~/services/page.server';

export const loader = async ({}) => {
  try {
    const page = getPage('gioi-thieu');
    return { page };
  } catch (error) {
    console.error('Error in loader:', error);
    return {};
  }
};

export const meta = () => {
  return [
    { title: 'Giới thiệu Iconic Pro' },
    {
      name: 'description',
      content:
        'Iconic Pro - Học viện Kỹ năng Chuyên nghiệp Ngành Làm đẹp. Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ của chúng tôi.',
    },
  ];
};

export default function AboutUs() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className=''>
      <Defer resolve={page}>
        {(page) => (
          <>
            <div>
              <img
                src={
                  page?.pst_thumbnail?.img_url ||
                  '/assets/gioi-thieu/banner.webp'
                }
                alt='Giới thiệu Iconic Pro'
              />
            </div>

            <div className='container grid-cols-1 py-8'>
              <TextRenderer content={page?.pst_content || ''} />
            </div>
          </>
        )}
      </Defer>
    </div>
  );
}
