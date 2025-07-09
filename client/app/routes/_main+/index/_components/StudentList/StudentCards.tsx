import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import InfoCard from '~/components/website/InfoCard';

export default function StudentCards({
  students,
  value,
}: {
  students: Array<{
    image: string;
    value: string;
    description: string;
  }>;
  value: string;
}) {
  return (
    <ScrollArea>
      <div className='lg:grid grid-cols-12 gap-x-2 lg:gap-x-8 gap-y-8 flex flex-nowrap'>
        {students.map((student, i) =>
          student.value === value ? (
            <InfoCard
              image={student.image}
              key={i}
              className='w-[300px] shadow-none'
            >
              <p className='text-black text-pretty mt-3 truncate-3-lines'>
                {student.description}
              </p>
            </InfoCard>
          ) : null,
        )}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
