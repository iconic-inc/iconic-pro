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
    <ul className='space-y-4'>
      {branches.map((branch, i) => (
        <li
          key={branch.id}
          className={`cursor-pointer ${
            selectedBranchIndex === i ? 'bg-[--main-bg-opacity] shadow-xl' : ''
          } text-[#333] p-6 rounded hover:text-[--main-color] transition-all`}
          onClick={() => setSelectedBranchIndex(i)}
        >
          <div className='flex flex-col gap-2'>
            <h3 className='font-bold text-xl'>{branch.bra_name}</h3>

            <p className='text-[--sub1-text]'>
              {toAddressString(branch.bra_address)}
            </p>

            <p className='text-[--sub1-text]'>Hotline: {branch.bra_msisdn}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
