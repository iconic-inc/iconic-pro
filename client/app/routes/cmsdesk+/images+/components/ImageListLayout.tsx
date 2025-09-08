import { Link } from '@remix-run/react';
import { IImage } from '~/interfaces/image.interface';

import ImageTypeMarkup from './ImageTypeMarkup';

export default function ImageListLayout({ images }: { images: IImage[] }) {
  return (
    <table className='table-auto col-span-12 w-full'>
      <thead className=''>
        <tr className=''>
          <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
            Hình ảnh
          </th>

          <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
            Tiêu đề
          </th>

          <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
            Đường dẫn
          </th>

          <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
            Loại
          </th>

          <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
            Thứ tự hiển thị
          </th>

          <th className='p-3 font-bold uppercase bg-zinc-200 border hidden lg:table-cell'>
            Trạng thái hiển thị
          </th>
        </tr>
      </thead>

      <tbody>
        {images.map((img, i) => (
          <tr
            key={i}
            className='bg-white lg:hover:bg-zinc-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0'
          >
            <td className='w-full lg:w-auto text-center border border-b block lg:table-cell relative lg:static hover:underline hover:text-main'>
              <Link to={`/cmsdesk/images/${img.id}`}>
                <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                  Hình ảnh
                </span>

                <div className='w-24 aspect-square overflow-hidden mx-auto'>
                  <img
                    src={img.img_url}
                    alt={img.img_title}
                    className='object-contain'
                  />
                </div>
              </Link>
            </td>

            <td className='max-w-md lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
              <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                Tiêu đề
              </span>
              <p className='truncate'>{img.img_title}</p>
            </td>

            <td className='max-w-[200px] lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
              <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                Đường dẫn
              </span>

              <a
                href={img.img_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:underline'
              >
                <p className='truncate'>{img.img_url}</p>
              </a>
            </td>

            <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
              <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                Loại
              </span>

              <ImageTypeMarkup type={img.img_type} />
            </td>

            <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
              <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                Thứ tự hiển thị
              </span>

              <p className='truncate'>{img.img_order}</p>
            </td>

            <td className='w-full lg:w-auto p-3 text-center border border-b block lg:table-cell relative lg:static'>
              <span className='lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase'>
                Trạng thái hiển thị
              </span>

              {img.img_isPublic ? (
                <p className='m-auto w-fit bg-green-500 rounded px-2 py-1 text-xs font-bold text-white'>
                  Công khai
                </p>
              ) : (
                <p className='m-auto w-fit rounded bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                  Ẩn
                </p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
