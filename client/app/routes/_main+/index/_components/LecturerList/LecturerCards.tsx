import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';
import TextRenderer from '~/components/website/TextRenderer';
import { IImage } from '~/interfaces/image.interface';

export default function LecturerCards({
  lecturers,
}: {
  lecturers: {
    label: string;
    value: string;
    images: IImage[];
  };
}) {
  return (
    <ScrollArea>
      <div className='grid-cols-12 gap-x-5 gap-y-8 flex flex-nowrap p-4'>
        {lecturers.images?.map((lecturer, i) => (
          <InfoCard
            key={i}
            className='col-span-2 w-[280px]'
            image={lecturer.img_url}
          >
            <h3 className='mt-4 uppercase font-bold text-main'>
              {lecturer.img_title}
            </h3>

            <h4 className='text-sm font-medium color-main my-2 text-main'>
              {lecturers.label}
            </h4>

            <div className='rounded-xl p-2.5 mt-4 text-sm bg-main/10'>
              <TextRenderer content={lecturer.img_description} />
            </div>
          </InfoCard>
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
