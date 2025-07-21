import { useLoaderData } from '@remix-run/react';
import { loader } from '../..';
import BranchCards from './BranchCards';
import SectionTitle from '~/components/website/SectionTitle';
import Defer from '~/components/Defer';
import { useEffect, useState } from 'react';
import { IBranch } from '~/interfaces/branch.interface';
import { getProvinceBySlug } from '~/utils/address.util';

export default function BranchList() {
  const { branches } = useLoaderData<typeof loader>();

  const [branchesByProvince, setBranchesByProvince] = useState<
    Array<{
      label: string;
      value: string;
      branches: IBranch[];
    }>
  >([]);
  const [activeTab, setActiveTab] = useState<string>(
    branchesByProvince[0]?.value || '',
  );

  useEffect(() => {
    const loadBranches = async () => {
      const loadedBranches = await branches;
      const groupedBranches = loadedBranches.reduce(
        (acc, branch) => {
          const province = branch.bra_address?.province || 'other';
          if (!acc[province]) {
            acc[province] = [];
          }
          acc[province].push(branch);
          return acc;
        },
        {} as Record<string, IBranch[]>,
      );
      setBranchesByProvince(
        Object.entries(groupedBranches).map(([value, branches]) => ({
          label: getProvinceBySlug(value)?.name || 'Khác',
          value,
          branches,
        })),
      );
      setActiveTab(Object.entries(groupedBranches)[0]?.[0] || ''); // Set the first province as active by default
    };

    loadBranches();
  }, [branches]);

  if (!branchesByProvince || branchesByProvince.length === 0) {
    return (
      <div className='col-span-12'>
        <p className='text-lg lg:text-xl text-[--sub1-text] text-center'>
          Hiện tại không có chi nhánh nào.
        </p>
      </div>
    );
  }

  return (
    <section id='branch' className=''>
      <div className='container grid-cols-1 gap-0'>
        <SectionTitle
          activeTab={activeTab}
          tabs={branchesByProvince}
          changeTabHandler={setActiveTab}
        >
          CHI NHÁNH
        </SectionTitle>
        <BranchCards
          branches={
            branchesByProvince.find((branch) => branch.value === activeTab)
              ?.branches || []
          }
        />
      </div>
    </section>
  );
}
