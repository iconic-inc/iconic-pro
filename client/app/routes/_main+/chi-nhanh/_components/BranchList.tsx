import { IBranch } from '~/interfaces/branch.interface';
import { toAddressString } from '~/utils/address.util';

export default function BranchList({
  branches,
  selectedBranchIndex,
  setSelectedBranchIndex,
}: {
  branches: IBranch[];
  selectedBranchIndex: number;
  setSelectedBranchIndex: (index: number) => void;
}) {
  return (
    <div className='w-full'>
      {/* Desktop: Vertical list */}
      <ul className='space-y-4'>
        {branches.map((branch, i) => (
          <li
            key={branch.id}
            className={`cursor-pointer ${
              selectedBranchIndex === i ? 'bg-main/10' : 'bg-white'
            } border-l-4 border-main text-[#333] p-6 rounded-lg hover:text-main transition-all shadow-xl`}
            onClick={() => setSelectedBranchIndex(i)}
          >
            <div className='flex flex-col gap-3'>
              <h3 className='font-bold text-xl'>{branch.bra_name}</h3>
              <p className='text-[--sub1-text] leading-relaxed'>
                {toAddressString(branch.bra_address)}
              </p>
              <p className='text-[--sub1-text] font-medium'>
                Hotline: {branch.bra_msisdn}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
