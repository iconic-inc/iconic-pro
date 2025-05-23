import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import {
  IJobPost,
  IJobPostAttrs,
  IJobPostDetails,
} from '~/interfaces/jobPost.interface';
import { IPaginationOptions, IResponseList } from '~/interfaces/app.interface';

/**
 * Admin services for job posts
 */
// Get all job posts with pagination and filtering
const listJobPosts = async (
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

  const response = await fetcher(`/job-posts?${searchParams.toString()}`, {
    request,
  });
  return response as IResponseList<IJobPostDetails>;
};

// Get job post by ID for admin
const getJobPostById = async (id: string, request: ISessionUser) => {
  const response = await fetcher(`/job-posts/${id}`, { request });
  return response as IJobPostDetails;
};

// Create new job post (admin)
const createJobPost = async (
  jobPostData: IJobPostAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/job-posts', {
      method: 'POST',
      body: JSON.stringify(jobPostData),
      request,
    });

    return response as IJobPost;
  } catch (error: any) {
    console.error('Error creating job post:', error);
    throw error;
  }
};

// Update job post information (admin)
const updateJobPost = async (
  id: string,
  data: Partial<IJobPostAttrs>,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/job-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });
    return response as IJobPost;
  } catch (error) {
    console.error('Error updating job post:', error);
    throw error;
  }
};

// Delete job post (admin)
const deleteJobPost = async (jobPostId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/job-posts/${jobPostId}`, {
      method: 'DELETE',
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting job post:', error);
    throw error;
  }
};

// Bulk delete job posts (admin)
const bulkDeleteJobPosts = async (
  jobPostIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/job-posts/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ jobPostIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk deleting job posts:', error);
    throw error;
  }
};

// Bulk hard delete job posts (admin)
const bulkHardDeleteJobPosts = async (
  jobPostIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/job-posts/bulk/hard', {
      method: 'DELETE',
      body: JSON.stringify({ jobPostIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk hard deleting job posts:', error);
    throw error;
  }
};

// Update job post status (admin)
const updateJobPostStatus = async (
  jobPostId: string,
  status: string,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/job-posts/${jobPostId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      request,
    });
    return response as IJobPost;
  } catch (error) {
    console.error('Error updating job post status:', error);
    throw error;
  }
};

/**
 * Owner services for job posts
 */
// List all job posts for spas owned by the current owner
const listMyJobPosts = async (
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
    `/spa-owners/me/job-posts?${searchParams.toString()}`,
    {
      request,
    },
  );
  return response as IResponseList<IJobPostDetails>;
};

// Create new job post for one of owner's spas
const createMyJobPost = async (
  jobPostData: IJobPostAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher('/spa-owners/me/job-posts', {
      method: 'POST',
      body: JSON.stringify(jobPostData),
      request,
    });

    return response as IJobPost;
  } catch (error: any) {
    console.error('Error creating job post:', error);
    throw error;
  }
};

// Get job post by ID (for owner)
const getMyJobPostById = async (id: string, request: ISessionUser) => {
  const response = await fetcher(`/spa-owners/me/job-posts/${id}`, { request });
  return response as IJobPostDetails;
};

// Update job post (for owner)
const updateMyJobPost = async (
  id: string,
  data: Partial<IJobPostAttrs>,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/me/job-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });
    return response as IJobPost;
  } catch (error) {
    console.error('Error updating job post:', error);
    throw error;
  }
};

// Delete job post (for owner)
const deleteMyJobPost = async (jobPostId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/spa-owners/me/job-posts/${jobPostId}`, {
      method: 'DELETE',
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting job post:', error);
    throw error;
  }
};

// Update job post status (for owner)
const updateMyJobPostStatus = async (
  jobPostId: string,
  status: string,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(
      `/spa-owners/me/job-posts/${jobPostId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        request,
      },
    );
    return response as IJobPost;
  } catch (error) {
    console.error('Error updating job post status:', error);
    throw error;
  }
};

export {
  // Admin services
  listJobPosts,
  getJobPostById,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  bulkDeleteJobPosts,
  bulkHardDeleteJobPosts,
  updateJobPostStatus,

  // Owner services
  listMyJobPosts,
  createMyJobPost,
  getMyJobPostById,
  updateMyJobPost,
  deleteMyJobPost,
  updateMyJobPostStatus,
};
