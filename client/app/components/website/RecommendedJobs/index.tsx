import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';

export default function RecommendedJobs() {
  return (
    <Card className='shadow-md hover:shadow-lg transition-all'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>
          Recommended Jobs
        </CardTitle>
        <Separator className='mt-2' />
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Job Card 1: UX Designer */}
          <Card className='hover:shadow-md transition-all'>
            <CardContent className='flex flex-col sm:flex-row items-start gap-3 p-4'>
              <img
                src='https://images.unsplash.com/photo-1632239776255-0a7f24814df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxtaWNyb3NvZnR8ZW58MHx8fHwxNzQ4NDg1MzY5fDA&ixlib=rb-4.1.0&q=80&w=1080'
                alt='Microsoft logo'
                className='w-10 h-10 rounded-md'
              />
              <div className='flex-1 mt-2 sm:mt-0'>
                <h3 className='font-medium'>UX Designer</h3>
                <p className='text-gray-500 text-sm'>Microsoft - Redmond, WA</p>
                <div className='flex gap-2 mt-2'>
                  <Badge variant='secondary'>Full-time</Badge>
                  <Badge variant='secondary'>Remote</Badge>
                </div>
                <div className='mt-3 flex justify-between items-center'>
                  <p className='text-primary-600 font-medium'>$120K - $150K</p>
                  <Button size='sm'>Apply Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Card 2: Product Designer */}
          <Card className='hover:shadow-md transition-all'>
            <CardContent className='flex flex-col sm:flex-row items-start gap-3 p-4'>
              <img
                src='https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxhcHBsZXxlbnwwfHx8fDE3NDg0NjI1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
                alt='Apple logo'
                className='w-10 h-10 rounded-md'
              />
              <div className='flex-1'>
                <h3 className='font-medium'>Product Designer</h3>
                <p className='text-gray-500 text-sm'>Apple - Cupertino, CA</p>
                <div className='flex gap-2 mt-2'>
                  <Badge variant='secondary'>Full-time</Badge>
                  <Badge variant='secondary'>On-site</Badge>
                </div>
                <div className='mt-3 flex justify-between items-center'>
                  <p className='text-primary-600 font-medium'>$130K - $160K</p>
                  <Button size='sm'>Apply Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className='mt-4 text-center justify-center'>
        <Button variant='outline'>View More Recommendations</Button>
      </CardFooter>
    </Card>
  );
}
