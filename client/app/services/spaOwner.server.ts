import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import {
  ISpaOwner,
  ISpaOwnerAttrs,
  ISpaOwnerDetails,
} from '~/interfaces/spaOwner.interface';
import { IPaginationOptions, IResponseList } from '~/interfaces/app.interface';

// Get all spa owners with pagination and filtering
const listSpaOwners = async (
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

  const response = await fetcher(`/spa-owners?${searchParams.toString()}`, {
    request,
  });
  return response as IResponseList<ISpaOwnerDetails>;
};

// Get spa owner by ID
const getSpaOwnerById = async (id: string, request: ISessionUser) => {
  const response = await fetcher(`/spa-owners/${id}`, { request });
  return response as ISpaOwnerDetails;
};

// Get my spa owner information
const getMySpaOwner = async (request: ISessionUser) => {
  try {
    const response = await fetcher('/spa-owners/me', { request });
    return response as ISpaOwner;
  } catch (error) {
    console.error('Error fetching my spa owner:', error);
    throw error;
  }
};

// Create new spa owner
const createSpaOwner = async (
  spaOwnerData: ISpaOwnerAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/spa-owners', {
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

// Update My spa owner information
const updateMySpaOwner = async (
  data: ISpaOwnerAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/me`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });
    return response as ISpaOwner;
  } catch (error) {
    console.error('Error updating my spa owner:', error);
    throw error;
  }
};

// Update spa owner information
const updateSpaOwner = async (
  id: string,
  data: ISpaOwnerAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/${id}`, {
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
const deleteSpaOwner = async (ownerId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/spa-owners/${ownerId}`, {
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
const bulkDeleteSpaOwners = async (
  ownerIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/spa-owners/bulk', {
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
const bulkHardDeleteSpaOwners = async (
  ownerIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/spa-owners/bulk/hard', {
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
const assignSpasToOwner = async (
  ownerId: string,
  spaIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/${ownerId}/assign-spa`, {
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
const updateOwnerStatus = async (
  ownerId: string,
  status: 'active' | 'suspended',
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/${ownerId}/status`, {
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
const changeOwnerPlan = async (
  ownerId: string,
  planData: { plan: string; expireAt?: string },
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/${ownerId}/plan`, {
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
const getOwnerAuditLog = async (
  ownerId: string,
  options: IPaginationOptions = {},
  request: ISessionUser,
) => {
  try {
    const { page = 1, limit = 10 } = options;
    const url = `/spa-owners/${ownerId}/audit?page=${page}&limit=${limit}`;

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
  listSpaOwners,
  getSpaOwnerById,
  createSpaOwner,
  updateSpaOwner,
  deleteSpaOwner,
  bulkDeleteSpaOwners,
  bulkHardDeleteSpaOwners,
  assignSpasToOwner,
  updateOwnerStatus,
  changeOwnerPlan,
  getOwnerAuditLog,
  getMySpaOwner,
  updateMySpaOwner,
};
