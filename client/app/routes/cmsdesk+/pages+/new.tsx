import { ActionFunctionArgs, LoaderFunctionArgs, data } from '@remix-run/node';

import { isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';
import { createPage } from '~/services/page.server';
import PageEditor from './components/PageEditor';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data(
      {
        success: false,
        toast: { message: 'Unauthorized', type: 'error' },
        page: null,
      },
      { headers },
    );
  }

  switch (request.method) {
    case 'POST':
      try {
        const r = request.clone();
        let formData = await r.formData();

        const folder = formData.get('folder') as string;
        const thumbnail = formData.get('thumbnail') as File;

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const template = formData.get('template') as string;
        const isPublished = formData.get('isPublished') === 'true';

        if (!title || !template) {
          return data(
            {
              toast: {
                message: 'Vui lòng điền đầy đủ thông tin!',
                type: 'error',
              },
              page: null,
            },
            { headers },
          );
        }

        // Save the page to the database
        const page = await createPage(
          { title, content, thumbnail, category, template, isPublished },
          session,
        );

        return data(
          {
            toast: {
              message: isPublished
                ? 'Bài viết được tạo thành công!'
                : 'Bản nháp được lưu thành công!',
              type: 'success',
            },
            page,
          },
          { headers },
        );
      } catch (error: any) {
        return data(
          {
            toast: {
              message: error.statusText || error.message,
              type: 'error',
            },
            page: null,
          },
          { headers },
        );
      }

    default:
      return data(
        {
          toast: { message: 'Method not allowed', type: 'error' },
          page: null,
        },
        { headers },
      );
  }
};

export default function CreatePage() {
  return <PageEditor />;
}
