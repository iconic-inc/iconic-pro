import { ActionFunctionArgs, LoaderFunctionArgs, data } from '@remix-run/node';

import { authenticator, isAuthenticated } from '~/services/auth.server';
import { parseAuthCookie } from '~/services/cookie.server';
import BranchEditor from './components/BranchEditor';
import {
  createBranch,
  deleteBranch,
  getBranchDetail,
  updateBranch,
} from '~/services/branch.server';
import { useLoaderData } from '@remix-run/react';
import { getMapLink } from '~/utils';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, message: 'Unauthorized' }, { headers });
  }

  const id = params.id;
  if (!id) {
    return data(
      {
        toast: {
          message: 'Branch not found',
          type: 'error',
        },
      },
      { headers, status: 404 },
    );
  }

  switch (request.method) {
    case 'PUT':
      try {
        let formData = await request.formData();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const msisdn = formData.get('msisdn') as string;
        const thumbnail = formData.get('thumbnail') as string;
        const map = formData.get('map') as string;
        const isMain = formData.get('isMain') === 'on';
        const province = formData.get('province') as string;
        const district = formData.get('district') as string;
        const street = formData.get('street') as string;

        if (
          !name ||
          !email ||
          !msisdn ||
          !thumbnail ||
          !map ||
          !province ||
          !district ||
          !street
        ) {
          return data(
            {
              toast: {
                message: 'Vui lòng điền đầy đủ thông tin!',
                type: 'error',
              },
              branch: null,
            },
            { headers },
          );
        }

        // Save the branch to the database
        const branch = await updateBranch(
          id,
          {
            name,
            email,
            msisdn,
            thumbnail,
            map: getMapLink(map),
            isMain,
            address: { province, district, street },
          },
          session,
        );

        return data(
          {
            toast: {
              message: 'Chi nhánh được cập nhật thành công!',
              type: 'success',
            },
            branch,
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
            branch: null,
          },
          { headers },
        );
      }

    case 'DELETE':
      try {
        // Delete the page from the database
        const res = await deleteBranch(id, session);
        return data(
          {
            res,
            toast: { message: 'Xóa chi nhánh thành công!', type: 'success' },
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
          toast: { message: 'Method not allowed', type: 'error' },
          branch: null,
        },
        { headers },
      );
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id) {
    throw new Response('Chi nhánh không tồn tại', { status: 404 });
  }

  const auth = await parseAuthCookie(request);
  if (!auth) {
    throw new Response('Unauthorized', { status: 401 });
  }

  // Fetch the branch from the database
  const branch = await getBranchDetail(id);
  if (!branch) {
    throw new Response('Chi nhánh không tồn tại', { status: 404 });
  }

  return { branch };
};

export default function BranchEdit() {
  const { branch } = useLoaderData<typeof loader>();

  return <BranchEditor branch={branch} type='update' />;
}
