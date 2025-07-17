import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Defer from '~/components/Defer';
import HandsomeError from '~/components/HandsomeError';
import PostDetail from '~/components/website/PostDetail';
import { getPage } from '~/services/page.server';

export const loader = ({ params }: LoaderFunctionArgs) => {
  try {
    const pageSlug = params.pageSlug;
    if (!pageSlug) {
      throw new Error('Page slug is required');
    }
    const page = getPage(pageSlug);
    return {
      page,
    };
  } catch (error) {
    console.error('Error in loader:', error);
    throw error;
  }
};

export default function PageNotFound() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <Defer resolve={page}>{(pageData) => <PostDetail page={pageData} />}</Defer>
  );
}

export const ErrorBoundary = () => <HandsomeError basePath='/' />;
