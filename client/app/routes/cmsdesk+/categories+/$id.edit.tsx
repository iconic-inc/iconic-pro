import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  data,
} from '@remix-run/node';
import { isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';
import { useLoaderData, useNavigate, useRevalidator } from '@remix-run/react';
import CategoryDetail from '~/widgets/CategoryDetail';
import {
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '~/services/category.server';
import { getPages } from '~/services/page.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, message: 'Unauthorized' }, { headers });
  }

  const { id } = params;
  const body = await request.json();

  switch (request.method) {
    case 'PUT': {
      try {
        await updateCategory(id || '', body, session);
        return data(null, { headers, status: 200 });
      } catch (error) {
        console.error('Error updating category:', error);
        return data(null, { headers, status: 500 });
      }
    }

    case 'DELETE': {
      try {
        await deleteCategory(id || '', session);
        return data(null, { headers, status: 200 });
      } catch (error) {
        console.error('Error deleting category:', error);
        return data(null, { headers, status: 500 });
      }
    }

    default: {
      return data(
        { toast: { message: 'Method not allowed', type: 'error' } },
        { headers },
      );
    }
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    if (!params.id) {
      throw new Response('Category ID is required', { status: 400 });
    }

    const auth = await parseAuthCookie(request);
    if (!auth) {
      throw new Response('Unauthorized', { status: 401 });
    }

    const category = await getCategory(params.id);
    const pages = await getPages({ isPublished: true, user: auth });
    const categories = await getCategories();

    return data({ category, pages, categories }, { headers: request.headers });
  } catch (error) {
    console.error('Error loading category detail:', error);
    if (error instanceof Response) {
      throw error;
    }
    return data({ category: null }, { headers: request.headers });
  }
};

export default function CategoryDetailPopup() {
  const { category, pages, categories } = useLoaderData<typeof loader>() as any;
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  return (
    <CategoryDetail
      category={category}
      pages={pages}
      categories={categories}
      popupHidder={() => {
        navigate('/cmsdesk/categories');
        revalidator.revalidate();
      }}
    />
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { category } = data || {};
  return [{ title: `${category?.cat_name}` }];
};
