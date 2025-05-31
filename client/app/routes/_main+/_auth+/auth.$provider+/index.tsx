import { ActionFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  const provider = params.provider;
  if (!provider || !['google', 'facebook'].includes(provider)) {
    throw new Response('Phương thức xác thực không hỗ trợ.', { status: 400 });
  }

  const res = await authenticator.authenticate(provider, request);
  console.log('Google authentication response:', res);
  return res;
};
