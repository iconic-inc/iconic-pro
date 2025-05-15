import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import {
  ISpaOwner,
  ISpaOwnerAttrs,
  ISpaOwnerDetails,
} from '~/interfaces/spaOwner.interface';
import { IPaginationOptions, IResponseList } from '~/interfaces/app.interface';

// Get all spa owners with pagination and filtering
const listSpaOwners4Admin = async (
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

  const response = await fetcher(
    `/admin/spa-owners?${searchParams.toString()}`,
    { request },
  );
  return response as IResponseList<ISpaOwnerDetails>;
};

// Get spa owner by ID
const getSpaOwnerById4Admin = async (id: string, request: ISessionUser) => {
  const response = await fetcher(`/admin/spa-owners/${id}`, { request });
  return response as ISpaOwnerDetails;
};

// Create new spa owner
const createSpaOwner4Admin = async (
  spaOwnerData: ISpaOwnerAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/admin/spa-owners', {
      method: 'POST',
      body: JSON.stringify(spaOwnerData),
      request,
    });

    return response as ISpaOwner;
  } catch (error: any) {
    console.error('Error creating spa owner:', error);
    throw error;
  }
};

// Update spa owner information
const updateSpaOwner4Admin = async (
  id: string,
  data: ISpaOwnerAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/admin/spa-owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });
    return response as ISpaOwner;
  } catch (error) {
    console.error('Error updating spa owner:', error);
    throw error;
  }
};

// Delete spa owner (soft delete)
const deleteSpaOwner4Admin = async (ownerId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/admin/spa-owners/${ownerId}`, {
      method: 'DELETE',
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting spa owner:', error);
    throw error;
  }
};

// Bulk delete spa owners (soft delete)
const bulkDeleteSpaOwners4Admin = async (
  ownerIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/admin/spa-owners/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ ownerIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk deleting spa owners:', error);
    throw error;
  }
};

// Bulk hard delete spa owners
const bulkHardDeleteSpaOwners4Admin = async (
  ownerIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/admin/spa-owners/bulk/hard', {
      method: 'DELETE',
      body: JSON.stringify({ ownerIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk hard deleting spa owners:', error);
    throw error;
  }
};

// Assign spas to owner
const assignSpasToOwner4Admin = async (
  ownerId: string,
  spaIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/admin/spa-owners/${ownerId}/assign-spa`, {
      method: 'PATCH',
      body: JSON.stringify({ spaIds }),
      request,
    });
    return response as ISpaOwner;
  } catch (error) {
    console.error('Error assigning spas to owner:', error);
    throw error;
  }
};

// Update owner status (active/suspended)
const updateOwnerStatus4Admin = async (
  ownerId: string,
  status: 'active' | 'suspended',
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/admin/spa-owners/${ownerId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      request,
    });
    return response as ISpaOwner;
  } catch (error) {
    console.error('Error updating owner status:', error);
    throw error;
  }
};

// Change subscription plan
const changeOwnerPlan4Admin = async (
  ownerId: string,
  planData: { plan: string; expireAt?: string },
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/admin/spa-owners/${ownerId}/plan`, {
      method: 'PATCH',
      body: JSON.stringify(planData),
      request,
    });
    return response as ISpaOwner;
  } catch (error) {
    console.error('Error changing owner plan:', error);
    throw error;
  }
};

// Get owner audit log
const getOwnerAuditLog4Admin = async (
  ownerId: string,
  options: IPaginationOptions = {},
  request: ISessionUser,
) => {
  try {
    const { page = 1, limit = 10 } = options;
    const url = `/admin/spa-owners/${ownerId}/audit?page=${page}&limit=${limit}`;

    const response = await fetcher(url, { request });
    return response as {
      logs: any[];
      total: number;
      page: number;
      limit: number;
    };
  } catch (error) {
    console.error('Error fetching owner audit log:', error);
    throw error;
  }
};

export {
  listSpaOwners4Admin,
  getSpaOwnerById4Admin,
  createSpaOwner4Admin,
  updateSpaOwner4Admin,
  deleteSpaOwner4Admin,
  bulkDeleteSpaOwners4Admin,
  bulkHardDeleteSpaOwners4Admin,
  assignSpasToOwner4Admin,
  updateOwnerStatus4Admin,
  changeOwnerPlan4Admin,
  getOwnerAuditLog4Admin,
};
