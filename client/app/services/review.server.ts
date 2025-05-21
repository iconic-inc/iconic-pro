import { ISessionUser } from '~/interfaces/auth.interface';
import { fetcher } from '.';
import {
  IReview,
  IReviewAttrs,
  IReviewDetails,
} from '~/interfaces/review.interface';
import { IPaginationOptions, IResponseList } from '~/interfaces/app.interface';

// ====================== CLIENT/USER ROUTES ======================

// Create a new review for a spa
const createReview = async (
  spaId: string,
  reviewData: IReviewAttrs,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/reviews/spas/${spaId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
      request,
    });

    return response as IReview;
  } catch (error: any) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Get user's own reviews with pagination
const listMyReviews = async (
  options: IPaginationOptions = {},
  request: ISessionUser,
) => {
  const { page = 1, limit = 10, sortBy, sortOrder } = options;
  const searchParams = new URLSearchParams();

  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortOrder) searchParams.set('sortOrder', sortOrder);
  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));

  const response = await fetcher(`/reviews?${searchParams.toString()}`, {
    request,
  });

  return response as IResponseList<IReview>;
};

// Get user's specific review by ID
const getMyReviewById = async (reviewId: string, request: ISessionUser) => {
  const response = await fetcher(`/reviews/${reviewId}`, { request });
  return response as IReview;
};

// Update user's review
const updateMyReview = async (
  reviewId: string,
  data: Partial<IReviewAttrs>,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      request,
    });

    return response as IReview;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete user's review
const deleteMyReview = async (reviewId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/reviews/${reviewId}`, {
      method: 'DELETE',
      request,
    });

    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// ====================== OWNER ROUTES ======================

// Get reviews for owner's spas
const listMySpaReviews4Owner = async (
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
    `/spa-owners/me/reviews?${searchParams.toString()}`,
    {
      request,
    },
  );

  return response as IResponseList<IReviewDetails>;
};

// Get specific review for owner's spa
const getMySpaReviewById4Owner = async (
  reviewId: string,
  request: ISessionUser,
) => {
  const response = await fetcher(`/spa-owners/me/reviews/${reviewId}`, {
    request,
  });
  return response as IReviewDetails;
};

// Reply to a review as an owner
const replyToReview4Owner = async (
  reviewId: string,
  replyText: string,
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/spa-owners/me/reviews/${reviewId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyText }),
      request,
    });

    return response as IReviewDetails;
  } catch (error) {
    console.error('Error replying to review:', error);
    throw error;
  }
};

// ====================== ADMIN ROUTES ======================

// List all reviews with admin access (pagination and filtering)
const listReviews4Admin = async (
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

  const response = await fetcher(`/reviews?${searchParams.toString()}`, {
    request,
  });

  return response as IResponseList<IReviewDetails>;
};

// Get review by ID (admin)
const getReviewById4Admin = async (reviewId: string, request: ISessionUser) => {
  const response = await fetcher(`/reviews/${reviewId}`, { request });
  return response as IReviewDetails;
};

// Approve a review
const approveReview4Admin = async (reviewId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/reviews/${reviewId}/approve`, {
      method: 'PATCH',
      request,
    });

    return response as IReviewDetails;
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

// Reject a review
const rejectReview4Admin = async ({
  reviewId,
  reason,
  request,
}: {
  reviewId: string;
  reason?: string;
  request: ISessionUser;
}) => {
  try {
    const response = await fetcher(`/reviews/${reviewId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
      request,
    });

    return response as IReviewDetails;
  } catch (error) {
    console.error('Error rejecting review:', error);
    throw error;
  }
};

// Delete review (admin)
const deleteReview4Admin = async (reviewId: string, request: ISessionUser) => {
  try {
    const response = await fetcher(`/reviews/${reviewId}`, {
      method: 'DELETE',
      request,
    });

    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Bulk delete reviews (admin)
const bulkHardDeleteReviews4Admin = async (
  reviewIds: string[],
  request: ISessionUser,
) => {
  try {
    const response = await fetcher(`/reviews/bulk`, {
      method: 'DELETE',
      body: JSON.stringify({ reviewIds }),
      request,
    });
    return response as { success: boolean; message: string };
  } catch (error) {
    console.error('Error bulk deleting reviews:', error);
    throw error;
  }
};

export {
  // Client/User routes
  createReview,
  listMyReviews,
  getMyReviewById,
  updateMyReview,
  deleteMyReview,

  // Owner routes
  listMySpaReviews4Owner,
  getMySpaReviewById4Owner,
  replyToReview4Owner,

  // Admin routes
  listReviews4Admin,
  getReviewById4Admin,
  approveReview4Admin,
  rejectReview4Admin,
  deleteReview4Admin,
  bulkHardDeleteReviews4Admin,
};
