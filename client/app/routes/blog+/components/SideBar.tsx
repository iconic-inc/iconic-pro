import { Star } from 'lucide-react';
import TextRenderer from '~/components/website/TextRenderer';
import { IPage } from '~/interfaces/page.interface';

export default function SideBar({ pages }: { pages: Array<IPage> }) {
  return (
    <aside className='col-span-3 max-md:hidden'>
      <div className=' mb-4'>
        <div className='flex justify-center items-center text-[--sub6-text] h-fit p-2 bg-[--main-color] uppercase font-medium'>
          <Star />
          <h2 className='ml-2 text-inherit'>Mới cập nhật</h2>
        </div>

        <div className='shadow-xl flex flex-col divide-y px-4 border '>
          {pages.slice(0, 4).map((a, i) => (
            <article key={i} className='w-full h-fit py-2'>
              <TextRenderer content={a.pst_excerpt} truncate />
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
