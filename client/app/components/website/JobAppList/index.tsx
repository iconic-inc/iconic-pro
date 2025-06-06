import { Info, MoreVertical, Search } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';

export default function JobAppList() {
  return (
    <div className='col-span-1 md:col-span-1 lg:col-span-3 spa-y-4 sm:space-y-6'>
      <Card className='shadow-md hover:shadow-lg transition-all'>
        <CardHeader className='flex flex-col gap-4'>
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
                  <p className='text-gray-500'>
                    Google, Inc. - San Francisco, CA
                  </p>
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

          {/* Search and Filter */}
          <div className='flex flex-col justify-between items-start gap-3 w-full'>
            <CardTitle className='text-lg font-semibold mb-0 sm:mb-0'>
              Job Applications
            </CardTitle>
            <Separator /> {/* Replaces border-b pb-2 */}
            <div className='flex flex-col sm:flex-row gap-2 w-full mt-2 z-10'>
              <div className='relative flex-1'>
                <Input
                  type='text'
                  placeholder='Search applications...'
                  className='pl-9'
                />
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
              </div>
              <Select>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='interview'>Interview</SelectItem>
                  <SelectItem value='offered'>Offered</SelectItem>
                  <SelectItem value='rejected'>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-4 relative z-0'>
          {/* Job Application Item - Interview Scheduled */}

          {/* Job Application Item - Offer Received */}

          {/* Job Application Item - Application Submitted */}

          {/* Job Application Item - Not Selected */}
          <div className='border rounded-lg p-4 hover:shadow-md transition-all bg-white relative overflow-hidden group'>
            <div className='absolute top-0 left-0 w-1 h-full bg-red-500'></div>
            <div className='flex flex-col items-start justify-between gap-3'>
              <div className='flex-1'>
                <div className='flex items-center gap-3'>
                  <img
                    src='https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxhbWF6b258ZW58MHx8fHwxNzQ4NTMwODU4fDA&ixlib=rb-4.1.0&q=80&w=1080'
                    alt='Amazon logo'
                    className='w-10 h-10 rounded-md'
                  />
                  <div>
                    <h3 className='font-medium'>Full Stack Developer</h3>
                    <p className='text-gray-500'>Amazon - Seattle, WA</p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
                <Badge
                  variant='outline'
                  className='bg-red-100 text-red-800 hover:bg-red-100'
                >
                  Not Selected
                </Badge>
                <p className='text-gray-500 text-sm'>Applied: May 10, 2023</p>
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
                <Info className='text-gray-500 h-4 w-4' />
                <span>Feedback: Position filled with internal candidate</span>
              </div>
              <div className='flex flex-wrap gap-2 mt-2'>
                <Button variant='outline'>View Similar Jobs</Button>
                <Button variant='secondary'>Archive</Button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col items-center gap-3 mt-6'>
          <p className='text-gray-500 text-sm'>Showing 4 of 12 applications</p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
