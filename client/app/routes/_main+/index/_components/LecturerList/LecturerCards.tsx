import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';

export default function LecturerCards({
  lecturers,
  value,
}: {
  lecturers: Array<{
    name: string;
    label: string;
    image: string;
    value: string;
  }>;
  value: string;
}) {
  return (
    <ScrollArea>
      <div className='grid-cols-12 gap-x-5 gap-y-8 flex flex-nowrap p-4'>
        {lecturers.map((lecturer, i) =>
          lecturer.value === value ? (
            <InfoCard
              key={i}
              className='col-span-2 w-[280px]'
              image={lecturer.image}
            >
              <h3 className='mt-4 uppercase font-bold text-main'>
                {lecturer.name}
              </h3>

              <h4 className='text-sm font-medium color-main my-2 text-main'>
                {lecturer.label}
              </h4>

              <p className='rounded-xl p-2.5 mt-4 text-sm bg-main/10'>
                Được đào tạo chuyên nghiệp trong lĩnh vực Chăm sóc da
              </p>
              <p className='rounded-xl p-2.5 mt-4 bg-main/10 text-sm'>
                Hơn 4 năm kinh nghiệm Chăm sóc da thẩm mỹ tại bệnh viện Da liễu
              </p>
            </InfoCard>
          ) : null,
        )}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
