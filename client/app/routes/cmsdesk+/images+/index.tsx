import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, LayoutGrid, ListChecks } from 'lucide-react';
import {
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from '@remix-run/react';

import { IImage } from '~/interfaces/image.interface';
import { getImages } from '~/services/image.server';
import { IMAGE } from '~/constants/image.constant';

import LoadingOverlay from '~/components/LoadingOverlay';
import { uploadImages } from '~/services/image.client';
import HandsomeError from '~/components/HandsomeError';
import ImageGridLayout from './components/ImageGridLayout';
import ImageListLayout from './components/ImageListLayout';
import Hydrated from '~/components/Hydrated';
import { SelectSearch } from '~/components/ui/SelectSearch';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  const query: Record<string, string> = {};
  if (type && type !== 'all') {
    query.type = type;
  }

  const images = await getImages(query);
  return { images };
};

export const meta = [
  {
    title: 'Danh sách ảnh',
  },
];

export default function ImagesPage() {
  const { images: fetchedImages } = useLoaderData<typeof loader>();

  const [images, setImages] = useState<IImage[]>(fetchedImages);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();

  const imageTypes = Object.values(IMAGE.TYPE).map((type) => ({
    value: type.value,
    label: type.optionLabel,
  }));

  const handleTypeChange = (value: string) => {
    setSelectedType(value);

    if (value === '' || value === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', value);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const searchParams = new URL(location.href).searchParams;
    if (searchParams.get('layout')) {
      setLayout(searchParams.get('layout') as 'grid' | 'list');
    }
    if (searchParams.get('type')) {
      const typeValue = searchParams.get('type') || '';
      setSelectedType(typeValue);
    }
  }, []);

  useEffect(() => {
    setImages(fetchedImages);
  }, [fetchedImages]);

  return (
    <div>
      <div className='w-full flex gap-4 items-center mb-4'>
        <div className='flex gap-2'>
          <button
            className={`border-2 rounded-lg p-2 transition-all ${
              layout === 'grid' ? 'border-blue-500' : 'border-gray-300'
            }`}
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('layout', 'grid');
              history.pushState(history.state, '', url.toString());
              setLayout('grid');
            }}
          >
            <LayoutGrid size={20} />
          </button>

          <button
            className={`border-2 rounded-lg p-2 transition-all ${
              layout === 'list' ? 'border-blue-500' : 'border-gray-300'
            }`}
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('layout', 'list');
              history.pushState(history.state, '', url.toString());
              setLayout('list');
            }}
          >
            <ListChecks size={20} />
          </button>
        </div>

        <div className='w-64'>
          <SelectSearch
            options={imageTypes}
            value={selectedType}
            onValueChange={handleTypeChange}
            placeholder='Chọn loại ảnh...'
            name='type'
            id='type'
          />
        </div>

        <Button
          className='bg-main'
          onClick={() => {
            handleTypeChange('');
          }}
        >
          Xoá bộ lọc
        </Button>
      </div>

      <div className='pt-4'>
        {layout === 'grid' ? (
          <ImageGridLayout images={images} />
        ) : (
          <ImageListLayout images={images} />
        )}
      </div>

      <button
        className='fixed bottom-10 right-10 center rounded-lg bg-blue-500 p-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg active:bg-blue-500/80'
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.multiple = true;
          input.onchange = async (e) => {
            setLoading(true);
            const files = (e.target as HTMLInputElement).files;
            if (!files || files.length === 0) {
              toast.error('No image selected');
              setLoading(false);
              return;
            }

            const res = await uploadImages(files);
            if (res?.success !== 1) {
              toast.error(res.toast.message);
              setLoading(false);
              return;
            }

            setImages((prev) => [...prev, ...res.images]);
            setLoading(false);
          };
          input.style.display = 'none';
          input.click();
        }}
      >
        <Plus />
      </button>

      {loading && <LoadingOverlay />}
    </div>
  );
}

export const ErrorBoundary = () => <HandsomeError basePath='/cmsdesk/images' />;
