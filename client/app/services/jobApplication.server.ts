import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import {
  IJobApplication,
  IJobApplicationAttrs,
  IJobApplicationDetails,
} from '~/interfaces/jobApplication.interface';
import { IPaginationOptions, IResponseList } from '~/interfaces/app.interface';

/**
 * Admin services for job posts
 */
// Get all job posts with pagination and filtering
const listJobApplications = async (
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
    `/job-applications?${searchParams.toString()}`,
    {
      request,
    },
  );
  return response as IResponseList<IJobApplicationDetails>;
};

// Get job post by ID for admin
const getJobApplicationById = async (id: string, request: ISessionUser) => {
  const response = await fetcher(`/job-applications/${id}`, { request });
  return response as IJobApplicationDetails;
};

// Create new job post (admin)
const createJobApplication = async (
  jobApplicationData: IJobApplicationAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/job-applications', {
      method: 'POST',
      body: JSON.stringify(jobApplicationData),
      request,
    });

    return response as IJobApplication;
  } catch (error: any) {
    console.error('Error creating job post:', error);
    throw error;
  }
};

// Update job post information (admin)
const updateJobApplication = async (
  id: string,
  data: Partial<IJobApplicationAttrs>,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/job-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });
    return response as IJobApplication;
  } catch (error) {
    console.error('Error updating job post:', error);
    throw error;
  }
};

// Delete job post (admin)
const deleteJobApplication = async (
  jobApplicationId: string,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/job-applications/${jobApplicationId}`, {
      method: 'DELETE',
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting job post:', error);
    throw error;
  }
};

/**
 * Owner services for job posts
 */
// List all job posts for spas owned by the current owner
const listMyJobApplications = async (
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
    `/spa-owners/me/job-applications?${searchParams.toString()}`,
    {
      request,
    },
  );
  return response as IResponseList<IJobApplicationDetails>;
};

// Get job post by ID (for owner)
const getMyJobApplicationById = async (id: string, request: ISessionUser) => {
  const response = await fetcher(`/spa-owners/me/job-applications/${id}`, {
    request,
  });
  return response as IJobApplicationDetails;
};

// Update job post (for owner)
const updateMyJobApplication = async (
  id: string,
  data: Partial<IJobApplicationAttrs>,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/me/job-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });
    return response as IJobApplication;
  } catch (error) {
    console.error('Error updating job post:', error);
    throw error;
  }
};

// Delete job post (for owner)
const deleteMyJobApplication = async (
  jobApplicationId: string,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(
      `/spa-owners/me/job-applications/${jobApplicationId}`,
      {
        method: 'DELETE',
        request,
      },
    );
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting job post:', error);
    throw error;
  }
};

export {
  // Admin services
  listJobApplications,
  getJobApplicationById,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,

  // Owner services
  listMyJobApplications,
  getMyJobApplicationById,
  updateMyJobApplication,
  deleteMyJobApplication,
};
