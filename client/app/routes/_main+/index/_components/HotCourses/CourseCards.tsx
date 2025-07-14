import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';

export default function CourseCard({
  services,
  value,
}: {
  services: Array<{
    label: string;
    description: string;
    image: string;
    value: string;
  }>;
  value: string;
}) {
  return (
    <ScrollArea>
      <div className='lg:grid grid-cols-12 gap-x-5 lg:gap-x-8 gap-y-8 flex flex-nowrap max-lg:p-4'>
        {services.map((s, i) =>
          s.value === value ? (
            <InfoCard
              key={i}
              className='col-span-2 lg:col-span-4 w-[320px]'
              title={s.label}
              button='Tìm hiểu thêm'
              image={s.image}
            >
              <p>{s.description}</p>
            </InfoCard>
          ) : null,
        )}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
