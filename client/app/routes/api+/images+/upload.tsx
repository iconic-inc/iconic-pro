import { ActionFunctionArgs, data } from '@remix-run/node';
import { authenticator, isAuthenticated } from '~/services/auth.server';
import { createImage } from '~/services/image.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  const body = await request.formData();

  if (!session) {
    return Response.json(
      {
        success: false,
        toast: { type: 'error', message: 'Vui lòng đăng nhập!' },
      },
      { headers, status: 401 },
    );
  }

  const folder = body.get('folder') as string;

  try {
    const files = body.getAll('img') as File[];
    if (!files.length) {
      return Response.json(
        {
          success: 0,
          toast: {
            message: 'Vui lòng chọn ít nhất một ảnh để tải lên!',
            type: 'error',
          },
        },
        { headers },
      );
    }

    const formData = new FormData();

    formData.append('folder', folder);
    for (let i = 0; i < files.length; i++) {
      formData.append('image', files[i]);
    }
    const images = await createImage(formData, session!);

    return Response.json(
      {
        images,
        success: 1,
        file: {
          url: images[0].img_url,
        },
        toast: { message: 'Upload ảnh thành công!', type: 'success' },
      },
      { headers },
    );
  } catch (error: any) {
    console.error(error);
    return Response.json(
      {
        success: 0,
        toast: { message: error.message, type: 'error' },
      },
      { headers },
    );
  }
};
