import SearchBox from '../SearchBox';

export default function SearchBar() {
  return (
    <section className='sticky top-[72px] w-full bg-[--sub3-color] py-2 col-span-12 z-40'>
      <div className='container'>
        <SearchBox sketch />
      </div>
    </section>
  );
}
