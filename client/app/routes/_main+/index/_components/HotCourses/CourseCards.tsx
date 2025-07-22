import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';
import TextRenderer from '~/components/website/TextRenderer';
import { IImage } from '~/interfaces/image.interface';

export default function CourseCard({
  courses,
  value,
}: {
  courses: Array<{
    label: string;
    value: string;
    images: IImage[];
  }>;
  value: string;
}) {
  const activeCourse = courses.find((s) => s.value === value);

  if (!activeCourse) {
    return null;
  }

  return (
    <ScrollArea>
      <div className='grid-cols-12 gap-x-5 gap-y-8 flex flex-nowrap p-4'>
        {activeCourse.images.map((image, i) => (
          <InfoCard
            key={i}
            className='col-span-2 lg:col-span-4 w-[320px]'
            title={image.img_title}
            button='Tìm hiểu thêm'
            image={image.img_url}
            imgRatio='aspeect-[3/2]'
          >
            <TextRenderer content={image.img_description} />
          </InfoCard>
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
