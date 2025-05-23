import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import {
  ICandidate,
  ICandidateAttrs,
  ICandidateDetails,
} from '~/interfaces/candidate.interface';
import { IPaginationOptions, IResponseList } from '~/interfaces/app.interface';

// Get all candidates with pagination and filtering
const listCandidates = async (
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

  const response = await fetcher(`/candidates?${searchParams.toString()}`, {
    request,
  });
  return response as IResponseList<ICandidateDetails>;
};

// Get candidate by ID
const getCandidateById = async (id: string, request: ISessionUser) => {
  const response = await fetcher(`/candidates/${id}`, { request });
  return response as ICandidateDetails;
};

// Create new candidate
const createCandidate = async (
  candidateData: ICandidateAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
      request,
    });

    return response as ICandidate;
  } catch (error: any) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

// Update candidate information
const updateCandidate = async (
  id: string,
  data: ICandidateAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });
    return response as ICandidate;
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
};

// Delete candidate (soft delete)
const deleteCandidate = async (ownerId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/candidates/${ownerId}`, {
      method: 'DELETE',
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};

// Bulk delete candidates (soft delete)
const bulkDeleteCandidates = async (
  ownerIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/candidates/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ ownerIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk deleting candidates:', error);
    throw error;
  }
};

// Bulk hard delete candidates
const bulkHardDeleteCandidates = async (
  ownerIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/candidates/bulk/hard', {
      method: 'DELETE',
      body: JSON.stringify({ ownerIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk hard deleting candidates:', error);
    throw error;
  }
};

export {
  listCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  bulkDeleteCandidates,
  bulkHardDeleteCandidates,
};
