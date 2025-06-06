import { ActionFunctionArgs, data } from '@remix-run/node';

import { authenticator, isAuthenticated } from '~/services/auth.server';
import BranchEditor from './components/BranchEditor';
import { createBranch } from '~/services/branch.server';
import { getMapLink } from '~/utils';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, headers } = await isAuthenticated(request);
  if (!session) {
    return data({ success: false, message: 'Unauthorized' }, { headers });
  }

  switch (request.method) {
    case 'POST':
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
              page: null,
            },
            { headers },
          );
        }

        // Save the page to the database
        const branch = await createBranch(
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
              message: 'Chi nhánh được tạo thành công!',
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

export default function CreateBranch() {
  return <BranchEditor type='create' />;
}
