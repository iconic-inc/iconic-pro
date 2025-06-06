import { CalendarDays, MoreVertical } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { IJobApplication } from '~/interfaces/jobApplication.interface';

export default function JobAppCardSubmitted({
  jobApp,
  onClick,
}: {
  jobApp: IJobApplication;
  onClick?: (jobApp: IJobApplication) => void;
}) {
  return (
    <div className='border rounded-lg p-4 hover:shadow-md transition-all bg-white relative overflow-hidden group'>
      <div className='absolute top-0 left-0 w-1 h-full bg-blue-500'></div>
      <div className='flex flex-col items-start justify-between gap-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-3'>
            <img
              src='https://images.unsplash.com/photo-1525770041010-2a1233dd8152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx0d2l0dGVyfGVufDB8fHx8MTc0ODUzMDc0NHww&ixlib=rb-4.1.0&q=80&w=1080'
              alt='Twitter logo'
              className='w-10 h-10 rounded-md'
            />
            <div>
              <h3 className='font-medium'>Product Designer</h3>
              <p className='text-gray-500'>Twitter - New York, NY</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2'>
          <Badge
            variant='outline'
            className='bg-blue-100 text-blue-800 hover:bg-blue-100'
          >
            Application Submitted
          </Badge>
          <p className='text-gray-500 text-sm'>Applied: June 20, 2023</p>
          <Button
            variant='ghost'
            size='icon'
            className='opacity-0 group-hover:opacity-100'
          >
            <MoreVertical className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <Separator className='my-4' /> {/* Replaces mt-3 pt-3 border-t */}
      <div className='flex flex-col justify-between text-sm gap-2'>
        <div className='flex items-center gap-2 flex-wrap'>
          <CalendarDays className='text-gray-500 h-4 w-4' />{' '}
          {/* Changed from 'schedule' icon */}
          <span>Status: Waiting for review</span>
        </div>
        <div className='flex flex-wrap gap-2 mt-2'>
          <Button variant='outline'>Follow Up</Button>
          <Button>View Details</Button>
        </div>
      </div>
    </div>
  );
}
