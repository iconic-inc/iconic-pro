import {
  Form,
  useFetcher,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { X } from 'lucide-react';
import {
  DetailedHTMLProps,
  FormEvent,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { JOB_POST } from '~/constants/jobPost.constant';

export default function SearchFilter({
  className,
  closeFilter,
}: {
  className?: string;
  closeFilter: () => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobPostType, setJobPostType] = useState<string>(
    searchParams.get('type') || '',
  );
  const [salaryFrom, setSalaryFrom] = useState<string>(
    searchParams.get('salaryFrom') || '',
  );
  const [salaryTo, setSalaryTo] = useState<string>(
    searchParams.get('salaryTo') || '',
  );
  const fetcher = useFetcher();
  const location = useLocation();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (jobPostType) {
      searchParams.set('type', jobPostType);
    } else {
      searchParams.delete('type');
    }
    if (salaryFrom) {
      searchParams.set('salaryFrom', salaryFrom);
    } else {
      searchParams.delete('salaryFrom');
    }
    if (salaryTo) {
      searchParams.set('salaryTo', salaryTo);
    } else {
      searchParams.delete('salaryTo');
    }

    searchParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setJobPostType(searchParams.get('type') || '');
    setSalaryFrom(searchParams.get('salaryFrom') || '');
    setSalaryTo(searchParams.get('salaryTo') || '');
  }, [searchParams]);

  return (
    <section
      className={`${className} fixed lg:sticky inset-0 bg-black/80 lg:bg-white lg:block col-span-3 lg:top-[162px] 
    border border-zinc-200 rounded-lg shadow bg-white p-2 lg:p-4 z-50 lg:z-10 h-full lg:h-fit
    flex justify-end`}
      onClick={closeFilter}
    >
      <fetcher.Form
        className='w-3/4 lg:w-full h-full'
        action={location.pathname + location.search}
        method='GET'
        onSubmit={(e) => {
          closeFilter();
          submitHandler(e);
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='w-full h-full flex flex-col justify-between gap-4 bg-white w-1/2 rounded-lg p-4 lg:p-0'>
          <div className='flex flex-col gap-4'>
            <div className='title'>
              <h3 className='text-lg font-semibold'>Bộ lọc</h3>
            </div>

            <div className='flex flex-col gap-4'>
              <h4 className='text-sm text-[--sub1-text]'>
                Loại hình tuyển dụng
              </h4>

              <div className='flex flex-wrap gap-2'>
                {Object.values(JOB_POST.TYPE).map((item, i) => (
                  <ColorfulCheckbox
                    key={i}
                    selected={jobPostType}
                    label={item.name}
                    value={item.slug}
                    name={item.slug}
                    onChange={(e) => {
                      setJobPostType((prev) => {
                        const types = prev ? prev.split(',') : [];

                        if (e.target.checked) {
                          // Add the new value if it doesn't exist
                          return [...types, item.slug].join(',');
                        } else {
                          // Remove the unchecked value
                          return types
                            .filter((type) => type !== item.slug)
                            .join(',');
                        }
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <h4 className='text-sm text-[--sub1-text]'>Lương từ:</h4>

              <div className='flex flex-wrap gap-2'>
                <NumericFormat
                  value={salaryFrom}
                  onValueChange={(values) => {
                    const { value } = values;
                    setSalaryFrom(value);
                  }}
                  thousandSeparator={true}
                  decimalScale={0}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  valueIsNumericString={true}
                  placeholder='Nhập lương tối thiểu'
                  className='w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-[--sub1-text]'
                  name='salaryFrom'
                />

                <NumericFormat
                  value={salaryTo}
                  onValueChange={(values) => {
                    const { value } = values;
                    setSalaryTo(value);
                  }}
                  thousandSeparator={true}
                  decimalScale={0}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  valueIsNumericString={true}
                  placeholder='Nhập lương tối đa'
                  className='w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-[--sub1-text]'
                  name='salaryTo'
                />
              </div>
            </div>
          </div>

          <div className='flex gap-4 mt-4'>
            <button
              className='text-base border border-zinc-200 text-[--sub1-text] rounded-lg px-6 py-2 h-full col-span-1 w-full'
              type='button'
              onClick={() => {
                setJobPostType('');
                setSalaryFrom('');
                setSalaryTo('');
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.delete('type');
                  newParams.delete('salaryFrom');
                  newParams.delete('salaryTo');
                  return newParams;
                });
              }}
            >
              Đặt lại
            </button>

            <button
              className='bg-[--sub4-color] text-white text-base rounded-lg px-6 py-2 h-full col-span-1 w-full'
              type='submit'
            >
              Áp dụng
            </button>
          </div>
        </div>
      </fetcher.Form>

      <button
        className='lg:hidden absolute top-4 left-4 text-[--sub3-text] hover:bg-white/30 p-2 rounded-full'
        onClick={closeFilter}
      >
        <X />
      </button>
    </section>
  );
}

const ColorfulCheckbox = ({
  selected,
  name,
  value,
  label,
  ...props
}: {
  selected: string;
  label: string;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className='flex'>
      <input
        id={name}
        type='checkbox'
        name={name}
        value={value}
        hidden
        {...props}
      />
      <label
        htmlFor={name}
        className={`select-none cursor-pointer rounded-lg border border-zinc-200 
          py-2 px-3 text-sm text-[--sub1-text]
          ${
            selected.split(',').includes(value as string)
              ? 'bg-main text-[--sub4-text] border-main'
              : ''
          }`}
      >
        {label}
      </label>
    </div>
  );
};
