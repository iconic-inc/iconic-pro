import { toast } from 'react-toastify';
import { LoaderFunctionArgs, MetaFunction, data } from '@remix-run/node';
import { useEffect, useRef, useState } from 'react';
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from '@remix-run/react';

import { toVnDateString } from '~/utils';
import { deleteImage, getImage, updateImage } from '~/services/image.server';
import HandsomeError from '~/components/HandsomeError';
import TextInput from '~/components/TextInput';
import { isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';
import LoadingOverlay from '~/components/LoadingOverlay';
import ImageMetadata from '~/components/ImageInput/ImagePicker/ImageMetadata';
import Select from '~/widgets/Select';
import TextAreaInput from '~/components/TextAreaInput';
import { IMAGE } from '~/constants/image.constant';
import TextEditor from '~/components/TextEditor';

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) throw new Response('Image not found', { status: 404 });

  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, message: 'Unauthorized' }, { headers });
  }

  try {
    switch (request.method) {
      case 'PUT': {
        const formData = new URLSearchParams(await request.text());
        // const name = formData.get('name');
        const title = formData.get('title');
        const type = formData.get('type');
        const isPublic = formData.get('isPublic');
        const link = formData.get('link');
        const description = formData.get('description');

        await updateImage(
          id,
          { title, type, isPublic, link, description },
          session,
        );

        return data(
          {
            toast: { message: 'Cập nhật thành công', type: 'success' },
          },
          { headers },
        );
      }

      case 'DELETE': {
        await deleteImage(id, session);

        return data(
          {
            imageId: id,
            toast: { message: 'Xóa ảnh thành công', type: 'success' },
          },
          { headers },
        );
      }

      default:
        throw new Response('Method not allowed', { status: 405 });
    }
  } catch (error: any) {
    return data(
      {
        toast: { message: error.message, type: 'error' },
      },
      { headers },
    );
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) throw new Response('Image not found', { status: 404 });

  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    const image = await getImage(id);

    return { image };
  } catch (error: any) {
    throw new Response(error.message, { status: error.status || 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { image } = data || {};

  return [
    {
      title: `Ảnh ${image?.img_title || image?.img_name}`,
      description: `Ảnh ${
        image?.img_title || image?.img_name
      } được tải lên vào ${toVnDateString(image?.updatedAt || '')}`,
    },
  ];
};

export default function ImagePopup() {
  const { image } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const fetcher = useFetcher<typeof action>();
  const toastIdRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState(image.img_description || '');

  const closePopupHandler = () => {
    if (!history.state?.idx) navigate('/cmsdesk/images');
    else navigate(-1);
  };

  useEffect(() => {
    const html = document.querySelector('html');

    if (html) {
      html.style.overflow = 'hidden';

      const escapeHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closePopupHandler();
      };
      document.addEventListener('keydown', escapeHandler);

      return () => {
        html.style.overflowY = 'auto';
        document.removeEventListener('keydown', escapeHandler);
      };
    }
  }, []);

  useEffect(() => {
    switch (fetcher.state) {
      case 'submitting':
        toastIdRef.current = toast.loading('Loading...', {
          autoClose: false,
        });
        setLoading(true);
        break;

      case 'loading':
        if (fetcher.data && toastIdRef.current) {
          const responseData = fetcher.data as any;
          let message = 'Operation completed';
          let toastType: 'success' | 'error' | 'info' = 'success';

          if (responseData.toast) {
            message = responseData.toast.message;
            toastType =
              (responseData.toast.type as 'success' | 'error') || 'success';
          } else if (responseData.message) {
            message = responseData.message;
            toastType = 'error';
          }

          toast.update(toastIdRef.current, {
            render: message,
            type: toastType,
            autoClose: 3000,
            isLoading: false,
          });

          toastIdRef.current = null;
          setLoading(false);

          if (fetcher.formMethod === 'DELETE' && responseData.imageId) {
            navigate('/cmsdesk/images');
          }
        }
        break;
    }
  }, [fetcher.state, fetcher.formMethod, navigate]);

  return (
    <div
      className='fixed inset-0 bg-black/70 flex h-full z-50 p-8 overflow-y-auto'
      onClick={closePopupHandler}
    >
      <section
        className='container h-full gap-8 p-8 rounded-xl bg-white divide-x divide-zinc-200 overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='col-span-6 flex-col items-center rounded-xl 
          text-[--sub11-text] overflow-hidden'
        >
          <img
            src={image?.img_url}
            alt={image.img_title}
            className='object-contain'
          />
        </div>

        <div className='col-span-6 flex flex-col px-4 -ml-4 justify-between h-full overflow-hidden'>
          <div className='flex flex-col divide-y divide-zinc-200 gap-8 h-full overflow-y-auto'>
            <ImageMetadata image={image} />

            <div className='-mt-4 py-4 overflow-y-auto shrink'>
              <fetcher.Form
                id='update-image'
                method='PUT'
                className='grid grid-cols-2 gap-4'
              >
                <div className='col-span-2'>
                  <TextInput
                    label='Tiêu đề'
                    name='title'
                    oneline
                    defaultValue={image.img_title}
                  />
                </div>

                <Select
                  label='Loại ảnh'
                  name='type'
                  defaultValue={image.img_type}
                  className='w-full'
                >
                  {Object.values(IMAGE.TYPE).map((type) => (
                    <option value={type.value} key={type.value}>
                      {type.optionLabel}
                    </option>
                  ))}
                </Select>

                <Select
                  label='Trạng thái hiển thị'
                  name='isPublic'
                  defaultValue={image.img_isPublic ? 'true' : 'false'}
                  className='w-full'
                >
                  <option value='true'>Công khai</option>
                  <option value='false'>Ẩn</option>
                </Select>

                <div className='col-span-2'>
                  <TextInput
                    label='Đường dẫn'
                    name='link'
                    oneline
                    defaultValue={image.img_link}
                  />
                </div>

                <div className='col-span-2'>
                  <label className='block mb-2 text-sm font-medium text-gray-700'>
                    Mô tả
                  </label>
                  <TextEditor
                    value={description}
                    onChange={(value) => setDescription(value)}
                    name='description'
                  />
                </div>
              </fetcher.Form>
            </div>
          </div>

          <div className='flex items-center justify-end gap-4'>
            <button
              className='text-red hover:text-orange-500'
              type='button'
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
                  fetcher.submit(null, { method: 'DELETE' });
                }
              }}
            >
              Xóa vĩnh viễn
            </button>

            <a
              href={image?.img_url}
              download={image.img_name}
              className='border-x border-zinc-200 px-4 hover:text-blue-500'
            >
              Tải về tệp tin
            </a>

            <button
              className='btn bg-blue-500 text-white hover:opacity-90 active:bg-blue-600 h-fit px-3 py-2'
              form='update-image'
              type='submit'
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </section>

      {loading && <LoadingOverlay />}
    </div>
  );
}

export const ErrorBoundary = () => <HandsomeError basePath='/cmsdesk/images' />;
