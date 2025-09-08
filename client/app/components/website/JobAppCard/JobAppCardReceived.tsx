import { DollarSign, MoreVertical } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { IJobApplication } from '~/interfaces/jobApplication.interface';

export default function JobAppCardReceived({
  jobApp,
  onClick,
}: {
  jobApp: IJobApplication;
  onClick?: (jobApp: IJobApplication) => void;
}) {
  return (
    <div className='border rounded-lg p-4 hover:shadow-md transition-all bg-white relative overflow-hidden group'>
      <div className='absolute top-0 left-0 w-1 h-full bg-green-500'></div>
      <div className='flex flex-col items-start justify-between gap-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-3'>
            <img
              src='https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxmYWNlYm9va3xlbnwwfHx8fDE3NDg1MzA2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
              alt='Facebook logo'
              className='w-10 h-10 rounded-md'
            />
            <div>
              <h3 className='font-medium'>UI/UX Designer</h3>
              <p className='text-gray-500'>Meta - Remote</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
          <Badge
            variant='outline'
            className='bg-green-100 text-green-800 hover:bg-green-100'
          >
            Offer Received
          </Badge>
          <p className='text-gray-500 text-sm'>Applied: May 28, 2023</p>
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
          <DollarSign className='text-green-500 h-4 w-4' />
          <span>Salary: $125,000 - $145,000</span>
        </div>
        <div className='flex flex-wrap gap-2 mt-2'>
          <Button
            variant='outline'
            className='border-green-500 text-green-600 hover:bg-green-50'
          >
            Consider Offer
          </Button>
          <Button className='bg-green-600 hover:bg-green-700'>
            Accept Offer
          </Button>
        </div>
      </div>
    </div>
  );
}
