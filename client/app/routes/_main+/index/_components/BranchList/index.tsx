import { useLoaderData } from '@remix-run/react';
import { loader } from '../..';
import BranchCards from './BranchCards';
import SectionTitle from '~/components/website/SectionTitle';
import Defer from '~/components/Defer';

export default function BranchList() {
  const { branches } = useLoaderData<typeof loader>();
  return (
    <section id='branch' className=''>
      <div className='container block'>
        <SectionTitle>CHI NHÁNH</SectionTitle>

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
            return <BranchCards branches={branches} />;
          }}
        </Defer>
      </div>
    </section>
  );
}
