import { redirect } from '@remix-run/react';

export const loader = () => {
  return redirect('/user/profile');
};
