import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';
import TextRenderer from '~/components/website/TextRenderer';
import { IImage } from '~/interfaces/image.interface';

export default function StudentCards({
  students,
}: {
  students: {
    label: string;
    value: string;
    images: IImage[];
  };
}) {
  return (
    <ScrollArea>
      <div className='grid-cols-12 gap-x-5 p-4 flex flex-nowrap'>
        {students.images?.map((student, i) => (
          <InfoCard image={student.img_url} key={i} className='w-[300px]'>
            <h3 className='text-xl text-main my-4'>
              {student.img_title || 'Học viên Iconic PRO'}
            </h3>
            <TextRenderer content={student.img_description} />
          </InfoCard>
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
