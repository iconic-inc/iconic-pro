import SearchBar from './SearchBar';
import SelectBar from './SelectBar';

export default function SearchHeader({
  openFilter,
}: {
  openFilter: () => void;
}) {
  return (
    <>
      <SearchBar />

      <section className='bg-white col-span-12'>
        <div className='container'>
          <div className='col-span-12 py-4'>
            <h1 className='text-2xl font-semibold leading-loose'>
              Top 25 spa tốt mới nhất Tháng {new Date().getMonth() + 1}/
              {new Date().getFullYear()}
            </h1>

            <p>
              Danh sách spa tốt mới nhất Tháng {new Date().getMonth() + 1}/
              {new Date().getFullYear()} bao gồm: spa tốt được review nhiều nhất
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
