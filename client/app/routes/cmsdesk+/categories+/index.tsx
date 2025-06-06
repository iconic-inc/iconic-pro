import { ActionFunctionArgs, LoaderFunctionArgs, data } from '@remix-run/node';
import { Link, Outlet, useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import TextInput from '~/components/TextInput';
import { isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';
import { createCategory, getCategories } from '~/services/category.server';
import {
  getLayer1Categories,
  getLayer2Categories,
  getLayer3Categories,
} from '~/utils/category.util';
import Select from '~/widgets/Select';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, message: 'Unauthorized' }, { headers });
  }

  switch (request.method) {
    case 'POST': {
      const body = await request.formData();
      const name = body.get('name');
      const order = body.get('order');
      const parent = body.get('parent');
      const url = body.get('url');

      if (!name) {
        return data(
          {
            toast: {
              message: 'Tên danh mục không được để trống',
              type: 'error',
            },
          },
          { headers },
        );
      }
      if (!order) {
        return data(
          {
            toast: { message: 'Chưa nhập thứ tự', type: 'error' },
          },
          { headers },
        );
      }
      if (!url) {
        return data(
          {
            toast: { message: 'Chưa nhập URL danh mục', type: 'error' },
          },
          { headers },
        );
      }

      // Add category to database
      await createCategory({ name, order, parent, url }, session);

      return data(
        {
          toast: { message: 'Thêm danh mục thành công', type: 'success' },
        },
        { headers },
      );
    }

    default: {
      return data(
        {
          toast: { message: 'Method not allowed', type: 'error' },
        },
        { headers },
      );
    }
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const auth = await parseAuthCookie(request);

  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const categories = await getCategories();

  return { categories };
};

export default function ManageCategories() {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const toastIdRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [order, setOrder] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      toastIdRef.current = toast.loading('Loading...', {
        autoClose: false,
      });
      setLoading(true);
    } else if (fetcher.state === 'idle' && fetcher.data && toastIdRef.current) {
      // Handle the response, which could have different shapes
      const responseData = fetcher.data as any;

      if (responseData.toast) {
        // Standard toast response
        toast.update(toastIdRef.current, {
          render: responseData.toast.message,
          type: responseData.toast.type || 'success',
          autoClose: 3000,
          isLoading: false,
        });

        if (responseData.toast.type === 'success') {
          setName('');
          setOrder('');
        }
      } else if (responseData.message) {
        // Error message response
        toast.update(toastIdRef.current, {
          render: responseData.message,
          type: 'error',
          autoClose: 3000,
          isLoading: false,
        });
      } else {
        // Fallback
        toast.update(toastIdRef.current, {
          render: 'Operation completed',
          type: 'info',
          autoClose: 3000,
          isLoading: false,
        });
      }

      toastIdRef.current = null;
      setLoading(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className='grid grid-cols-12 gap-16'>
      <Outlet />

      <fetcher.Form
        method='POST'
        action='/cmsdesk/categories'
        className='col-span-6 space-y-6'
      >
        <h2 className='text-2xl font-semibold'>Thêm danh mục</h2>

        <TextInput
          label='Tên danh mục'
          name='name'
          value={name}
          onChange={setName}
          placeholder='Nhập tên danh mục'
          required
        />

        <TextInput
          label='URL danh mục'
          name='url'
          value={url}
          onChange={setUrl}
          placeholder='Nhập URL danh mục (ví dụ: /danh-muc/san-pham)'
          required
        />

        <TextInput
          label='Thứ tự'
          name='order'
          type='number'
          step={100}
          value={order}
          onChange={setOrder}
          required
        />

        <Select
          label='Danh mục cha'
          name='parent'
          className='w-full'
          defaultValue=''
        >
          <option value=''>Không có</option>
          {[
            ...getLayer1Categories(categories),
            ...getLayer2Categories(categories),
          ].map((cat, i) => (
            <option key={i} value={cat.id}>
              {cat.cat_name}
            </option>
          ))}
        </Select>

        <div className='flex w-full justify-end'>
          <button
            className='center rounded-lg bg-blue-500 py-2 px-3 font-sans font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg enable:active:bg-blue-500/80 disabled:opacity-60'
            type='submit'
            disabled={loading || !name || !order || !url}
          >
            Thêm danh mục
          </button>
        </div>
      </fetcher.Form>

      <div className='col-span-6 space-y-6'>
        <h2 className='text-2xl font-semibold'>Danh sách danh mục</h2>

        <ul className='space-y-2 px-4'>
          {getLayer1Categories(categories).map((cat1, i) => (
            <li key={i}>
              <Link
                to={`/cmsdesk/categories/${cat1.id}/edit`}
                className='text-blue-800 hover:underline'
              >
                {`${cat1.cat_order} - ${cat1.cat_name}`}
              </Link>

              <ul className='pl-2'>
                {getLayer2Categories(categories, cat1).map((cat2, j) => (
                  <li key={j} className='my-2 text-blue-800'>
                    <span className='text-sm'>-- </span>
                    <Link
                      to={`/cmsdesk/categories/${cat2.id}/edit`}
                      className='hover:underline'
                    >
                      {`${cat2.cat_order} - ${cat2.cat_name}`}
                    </Link>

                    <ul className='pl-2'>
                      {getLayer3Categories(categories, cat2).map((cat3, k) => (
                        <li key={k} className='my-2 text-blue-800'>
                          <span className='text-sm'>---- </span>
                          <Link
                            to={`/cmsdesk/categories/${cat3.id}/edit`}
                            className='hover:underline'
                          >
                            {`${cat3.cat_order} - ${cat3.cat_name}`}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
