import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const location = params.location || 'toan-quoc';
  const category = params.category || 'viec-lam';
  const query = url.searchParams.get('q') || '';
  const page = url.searchParams.get('page') || '1';

  return {
    location,
    category,
    query,
    page,
  };
};

export default function SearchPage() {
  const { location, category, query, page } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Search Page</h1>
      <p>This is a placeholder for the search page.</p>
      <p>Location: {location}</p>
      <p>Category: {category}</p>
      <p>Query: {query}</p>
      <p>Page: {page}</p>
      <p>To be implemented...</p>
    </div>
  );
}
