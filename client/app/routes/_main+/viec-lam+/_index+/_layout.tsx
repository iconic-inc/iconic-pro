import { Outlet } from '@remix-run/react';
import { useState } from 'react';
import SearchHeader from '../_components/SearchHeader';
import SearchFilter from '~/widgets/SearchFilter';
import HandsomeError from '~/components/HandsomeError';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

export const loader = ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { type: jobPostType } = params;
  const keyword = url.searchParams.get('q') || '';
  return {
    jobPostType,
    keyword,
  };
};

export default function SearchPage() {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className='col-span-12 bg-slate-200/50'>
      <SearchHeader openFilter={() => setOpenFilter(true)} />

      <div className='container grid grid-cols-12 gap-6 py-4'>
        <SearchFilter
          className={`transition-all duration-500 ${
            openFilter ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full'
          }`}
          closeFilter={() => setOpenFilter(false)}
        />

        <div className='col-span-12 lg:col-span-9 flex flex-col gap-6'>
          <div className='flex items-center justify-end lg:hidden'>
            <Button
              variant='outline'
              className='w-fit bg-white'
              onClick={() => setOpenFilter(!openFilter)}
            >
              <span className='material-symbols-outlined'>
                {openFilter ? 'close' : 'filter_list'}
              </span>
            </Button>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export const ErrorBoundary = () => <HandsomeError />;
