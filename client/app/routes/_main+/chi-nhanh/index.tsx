import { IPageDetail } from '~/interfaces/page.interface';
import { useState } from 'react';
import BranchList from './_components/BranchList';
import MapDisplay from './_components/MapDisplay';
import Defer from '~/components/Defer';
import { parseAuthCookie } from '~/services/cookie.server';
import { getBranches } from '~/services/branch.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: { request: Request }) => {
  const session = await parseAuthCookie(request);
  const branches = getBranches();
  return { branches };
};

export default function BranchPage({ page }: { page: IPageDetail }) {
  const { branches } = useLoaderData<typeof loader>();

  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  return (
    <div className='container grid-cols-1 gap-0 py-8'>
      <h1 className='text-4xl text-main text-center font-bold mb-8'>
        Ghé thăm chúng tôi
      </h1>

      <Defer resolve={branches}>
        {(branches) => {
          if (!branches || branches.length === 0) {
            return (
              <div className='col-span-12'>
                <p className='text-lg lg:text-xl text-[--sub1-text] text-center'>
                  Hiện tại không có chi nhánh nào.
                </p>
              </div>
            );
          }
          return (
            <div className='flex flex-col gap-6 lg:gap-8'>
              <div className=''>
                <BranchList
                  branches={branches}
                  selectedBranchIndex={selectedBranchIndex}
                  setSelectedBranchIndex={setSelectedBranchIndex}
                />
              </div>

              <div className=''>
                <MapDisplay branch={branches[selectedBranchIndex]} />
              </div>
            </div>
          );
        }}
      </Defer>
    </div>
  );
}
