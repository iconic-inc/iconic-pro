import { IPageDetail } from '~/interfaces/page.interface';
import { useState } from 'react';
import BranchList from './_components/BranchList';
import VideoDisplay from './_components/VideoDisplay';
import { useMainLoaderData } from '~/lib/useMainLoaderData';
import MapDisplay from './_components/MapDisplay';
import Defer from '~/components/Defer';

export default function ILOSystemPage({ page }: { page: IPageDetail }) {
  const { branches } = useMainLoaderData();

  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  return (
    <div className='container py-16'>
      <h1 className='col-span-12 text-6xl font-bold text-center text-[--sub1-text]'>
        Ghé thăm chúng tôi
      </h1>

      <Defer resolve={branches}>
        {(branches) => {
          if (!branches || branches.length === 0) {
            return (
              <div className='col-span-12'>
                <p className='text-xl text-[--sub1-text] text-center'>
                  Hiện tại không có chi nhánh nào.
                </p>
              </div>
            );
          }
          return (
            <>
              <div className='col-span-4'>
                <BranchList
                  branches={branches}
                  selectedBranchIndex={selectedBranchIndex}
                  setSelectedBranchIndex={setSelectedBranchIndex}
                />
              </div>

              <div className='col-span-8'>
                {/* <VideoDisplay
            branch={branches.find((bra) => bra.id === selectedBranch)!}
          /> */}
                <MapDisplay branch={branches[selectedBranchIndex]} />
              </div>
            </>
          );
        }}
      </Defer>
    </div>
  );
}
