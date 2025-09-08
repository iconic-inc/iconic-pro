import { CalendarDays, MoreVertical } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';

export default function JobAppCardScheduled() {
  return (
    <div className='border rounded-lg p-4 hover:shadow-md transition-all bg-white relative overflow-hidden group'>
      <div className='absolute top-0 left-0 w-1 h-full bg-amber-500'></div>
      <div className='flex flex-col items-start justify-between gap-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-3'>
            <img
              src='https://images.unsplash.com/photo-1718724610253-515d745a4bef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxnb29nbGV8ZW58MHx8fHwxNzQ4NDIyMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080'
              alt='Google logo'
              className='w-10 h-10 rounded-md'
            />
            <div>
              <h3 className='font-medium'>Senior Frontend Developer</h3>
              <p className='text-gray-500'>Google, Inc. - San Francisco, CA</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2'>
          <Badge
            variant='outline'
            className='bg-amber-100 text-amber-800 hover:bg-amber-100'
          >
            Interview Scheduled
          </Badge>
          <p className='text-gray-500 text-sm'>Applied: June 15, 2023</p>
          <Button
            variant='ghost'
            size='icon'
            className='opacity-0 group-hover:opacity-100'
          >
            <MoreVertical className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <Separator className='my-4' /> {/* Replaces mt-4 pt-4 border-t */}
      <div className='flex flex-col justify-between text-sm gap-2'>
        <div className='flex items-center gap-2'>
          <CalendarDays className='text-gray-500 h-4 w-4' />
          <span>Interview: June 28, 2023 at 2:00 PM</span>
        </div>
        <div className='flex flex-wrap gap-2 mt-2'>
          <Button variant='outline'>Prepare</Button>
          <Button>View Details</Button>
        </div>
      </div>
    </div>
  );
}
