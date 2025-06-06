import { ActionFunctionArgs, LoaderFunctionArgs, data } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';
import { deletePage, getPostDetail, updatePage } from '~/services/page.server';
import PageEditor from './components/PageEditor';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const id = params.id;
  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: 'Page not found',
    });
  }

  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data(
      { success: false, toast: { type: 'error', message: 'Unauthorized' } },
      { headers },
    );
  }

  switch (request.method) {
    case 'PUT':
      try {
        let formData = await request.formData();

        const folder = formData.get('folder') as string;
        const thumbnail = formData.get('thumbnail') as File;

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const template = formData.get('template') as string;
        const isPublished = formData.get('isPublished');

        // Save the page to the database
        const page = await updatePage(
          id,
          { title, content, thumbnail, category, template, isPublished },
          session,
        );

        return data(
          {
            page,
            toast: {
              message: 'Cập nhật bài viết thành công!',
              type: 'success',
            },
          },
          { headers },
        );
      } catch (error: any) {
        console.error(error);
        return data(
          {
            toast: { message: error.message, type: 'error' },
          },
          { headers },
        );
      }

    case 'DELETE':
      try {
        // Delete the page from the database
        const res = await deletePage(id, session);
        return data(
          {
            res,
            toast: { message: 'Xóa bài viết thành công!', type: 'success' },
          },
          { headers },
        );
      } catch (error: any) {
        console.error(error);
        return data(
          {
            toast: { message: error.message, type: 'error' },
          },
          { headers },
        );
      }

    default:
      return data(
        {
          error: 'Method not allowed',
          toast: { message: 'Có lỗi xảy ra!', type: 'error' },
        },
        { headers },
      );
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id) {
    throw new Response('Page not found', { status: 404 });
  }

  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  // Fetch the page from the database
  const page = await getPostDetail(id, auth);

  return { page };
};

export default function EditPage() {
  const { page } = useLoaderData<typeof loader>();

  return <PageEditor page={page} />;
}
