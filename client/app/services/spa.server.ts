import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import { ISpa, ISpaAttrs, ISpaDetails } from '~/interfaces/spa.interface';
import { IPaginationOptions, IResponseList } from '~/interfaces/app.interface';

// ====================== CLIENT/PUBLIC ROUTES ======================

// Browse/search spas with pagination and filtering
const listSpas = async (
  query: any = {},
  options: IPaginationOptions = {},
  request?: ISessionUser,
) => {
  const { page = 1, limit = 10, sortBy, sortOrder } = options;
  const searchParams = new URLSearchParams();

  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortOrder) searchParams.set('sortOrder', sortOrder);
  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));

  // Add search filters
  if (query.keyword) searchParams.set('keyword', query.keyword);
  if (query.category) searchParams.set('category', query.category);
  if (query.ratingFrom)
    searchParams.set('ratingFrom', String(query.ratingFrom));

  // Geo search params
  if (query.lng && query.lat) {
    searchParams.set('lng', String(query.lng));
    searchParams.set('lat', String(query.lat));
    if (query.radiusKm) searchParams.set('radiusKm', String(query.radiusKm));
  }

  const response = await fetcher(
    `/spas?${searchParams.toString()}`,
    request ? { request } : undefined,
  );

  return response as IResponseList<ISpaDetails>;
};

// Get public spa details by ID
const getSpaById = async (spaId: string, request?: ISessionUser) => {
  const response = await fetcher(
    `/spas/${spaId}`,
    request ? { request } : undefined,
  );

  return response as ISpaDetails;
};

// ====================== OWNER ROUTES ======================

// Get all spas owned by the current user
const listMySpas4Owner = async (
  query: any = {},
  options: IPaginationOptions = {},
  request: ISessionUser,
) => {
  const { page = 1, limit = 10, sortBy, sortOrder } = options;
  const searchParams = new URLSearchParams();

  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortOrder) searchParams.set('sortOrder', sortOrder);
  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const response = await fetcher(
    `/spa-owners/me/spas?${searchParams.toString()}`,
    {
      request,
    },
  );

  return response as IResponseList<ISpa>;
};

// Create a spa as an owner
const createSpa4Owner = async (spaData: ISpaAttrs, request: ISessionUser) => {
  try {
    const response = await fetcher('/spa-owners/me/spas', {
      method: 'POST',
      body: JSON.stringify(spaData),
      request,
    });

    return response as ISpa;
  } catch (error: any) {
    console.error('Error creating spa:', error);
    throw error;
  }
};

// Get spa by ID (owner access)
const getSpaById4Owner = async (spaId: string, request: ISessionUser) => {
  const response = await fetcher(`/spa-owners/me/spas/${spaId}`, { request });
  return response as ISpa;
};

// Update spa information (owner access)
const updateSpa4Owner = async (
  spaId: string,
  data: Partial<ISpaAttrs>,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/me/spas/${spaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });

    return response as ISpa;
  } catch (error) {
    console.error('Error updating spa:', error);
    throw error;
  }
};

// Delete spa (owner access)
const deleteSpa4Owner = async (spaId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/spa-owners/me/spas/${spaId}`, {
      method: 'DELETE',
      request,
    });

    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting spa:', error);
    throw error;
  }
};

// ====================== ADMIN ROUTES ======================

// List all spas with admin access (pagination and filtering)
const listSpas4Admin = async (
  query: any = {},
  options: IPaginationOptions = {},
  request: ISessionUser,
) => {
  const { page = 1, limit = 10, sortBy, sortOrder } = options;
  const searchParams = new URLSearchParams(query);

  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortOrder) searchParams.set('sortOrder', sortOrder);
  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));

  const response = await fetcher(`/spas?${searchParams.toString()}`, {
    request,
  });

  return response as IResponseList<ISpa>;
};

// Create new spa (admin)
const createSpa4Admin = async (spaData: ISpaAttrs, request: ISessionUser) => {
  try {
    const response = await fetcher('/spas', {
      method: 'POST',
      body: JSON.stringify(spaData),
      request,
    });

    return response as ISpa;
  } catch (error: any) {
    console.error('Error creating spa:', error);
    throw error;
  }
};

// Get spa by ID (admin)
const getSpaById4Admin = async (spaId: string, request: ISessionUser) => {
  const response = await fetcher(`/spas/${spaId}`, { request });
  return response as ISpaDetails;
};

// Update spa (admin)
const updateSpa4Admin = async (
  spaId: string,
  data: Partial<ISpaAttrs>,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spas/${spaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });

    return response as ISpa;
  } catch (error) {
    console.error('Error updating spa:', error);
    throw error;
  }
};

// Delete spa (admin)
const deleteSpa4Admin = async (spaId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/spas/${spaId}`, {
      method: 'DELETE',
      request,
    });

    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting spa:', error);
    throw error;
  }
};

// Bulk delete spas (admin)
const bulkDeleteSpas4Admin = async (
  spaIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/spas/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ spaIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk deleting spas:', error);
    throw error;
  }
};

// Bulk hard delete spas (admin)
const bulkHardDeleteSpas4Admin = async (
  spaIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/spas/bulk/hard', {
      method: 'DELETE',
      body: JSON.stringify({ spaIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk hard deleting spas:', error);
    throw error;
  }
};

// Update spa status (admin) - approve, reject, suspend
const updateSpaStatus4Admin = async (
  spaId: string,
  status: 'approved' | 'rejected' | 'suspended' | 'pending',
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spas/${spaId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      request,
    });

    return response as ISpa;
  } catch (error) {
    console.error('Error updating spa status:', error);
    throw error;
  }
};

// Toggle featured status (admin)
const toggleFeatured4Admin = async (
  spaId: string,
  featured: boolean,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spas/${spaId}/feature`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
      request,
    });

    return response as ISpa;
  } catch (error) {
    console.error('Error toggling spa featured status:', error);
    throw error;
  }
};

export {
  // Client/Public routes
  listSpas,
  getSpaById,

  // Owner routes
  listMySpas4Owner,
  createSpa4Owner,
  getSpaById4Owner,
  updateSpa4Owner,
  deleteSpa4Owner,

  // Admin routes
  listSpas4Admin,
  createSpa4Admin,
  getSpaById4Admin,
  updateSpa4Admin,
  deleteSpa4Admin,
  bulkDeleteSpas4Admin,
  bulkHardDeleteSpas4Admin,
  updateSpaStatus4Admin,
  toggleFeatured4Admin,
};
