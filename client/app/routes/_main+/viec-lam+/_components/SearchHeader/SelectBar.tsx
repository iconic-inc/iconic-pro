import { Filter } from 'lucide-react';
import Select from '~/widgets/Select';

export default function SelectBar({ openFilter }: { openFilter: () => void }) {
  return (
    <section className='options sticky top-[112px] lg:top-[144px] bg-white py-2 shadow-sm col-span-12 z-20'>
      <div className='container flex flex-col lg:flex-row flex-col-reverse gap-4 justify-between items-start lg:items-center text-sm'>
        <div className='col-span-12 flex gap-2 lg:gap-4'>
          <button
            className='lg:hidden bg-slate-200/50 rounded p-3'
            onClick={openFilter}
          >
            <Filter />
          </button>

          <Select label='Lương từ:' className='px-4'>
            {[
              {
                label: '1 triệu',
                value: 1_000_000,
              },
              {
                label: '3 triệu',
                value: 3_000_000,
              },
              {
                label: '5 triệu',
                value: 5_000_000,
              },
              {
                label: '7 triệu',
                value: 7_000_000,
              },
              {
                label: '10 triệu',
                value: 10_000_000,
              },
              {
                label: '15 triệu',
                value: 15_000_000,
              },
              {
                label: '20 triệu',
                value: 20_000_000,
              },
              {
                label: '25 triệu',
                value: 25_000_000,
              },
            ].map(({ label, value }, i) => (
              <option className='' value={value} key={i}>
                {label}
              </option>
            ))}
          </Select>

          <Select label='Lương đến:' className='px-4'>
            {[
              {
                label: '5 triệu',
                value: 5_000_000,
              },
              {
                label: '7 triệu',
                value: 7_000_000,
              },
              {
                label: '10 triệu',
                value: 10_000_000,
              },
              {
                label: '15 triệu',
                value: 15_000_000,
              },
              {
                label: '20 triệu',
                value: 20_000_000,
              },
              {
                label: '25 triệu',
                value: 25_000_000,
              },
              {
                label: '30 triệu',
                value: 30_000_000,
              },
              {
                label: '50 triệu',
                value: 50_000_000,
              },
            ].map(({ label, value }, i) => (
              <option className='' value={value} key={i}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <p className='max-lg:text-xs'>
          <b>Tìm thấy:</b> {11} trường
        </p>
      </div>
    </section>
  );
}
