import slugify from 'slugify';
import {
  formatAttributeName,
  getReturnData,
  getReturnList,
  removeNestedNullish,
} from '@utils/index';
import { isValidObjectId, ObjectId, startSession } from 'mongoose';

import { IPageAttrs } from '../interfaces/page.interface';
import { PageModel } from '../models/page.model';
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../core/errors';
import { PAGE } from '../constants';
import { extractExcerpt } from '@utils/page.util';

// Constants for pagination and limits
const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 1000;

/**
 * Validate and normalize limit parameter
 * @param limit - Limit value to validate
 * @returns Validated limit or undefined if not provided
 */
const validateLimit = (limit?: number | string): number | undefined => {
  if (limit === undefined) {
    return undefined;
  }

  if (typeof limit === 'string') {
    limit = parseInt(limit, 10);
  }
  if (typeof limit !== 'number' || limit < 0) {
    throw new BadRequestError('Limit must be a non-negative number');
  }

  if (limit > MAX_PAGE_LIMIT) {
    throw new BadRequestError(`Limit cannot exceed ${MAX_PAGE_LIMIT} pages`);
  }

  return limit;
};

/**
 * Validate and normalize skip/offset parameter
 * @param skip - Skip value to validate
 * @returns Validated skip or undefined if not provided
 */
const validateSkip = (skip?: number | string): number | undefined => {
  if (skip === undefined) {
    return undefined;
  }

  if (typeof skip === 'string') {
    skip = parseInt(skip, 10);
  }
  if (typeof skip !== 'number' || skip < 0) {
    throw new BadRequestError('Skip must be a non-negative number');
  }

  return skip;
};

/**
 * Generate a unique slug for a page
 * @param title - Page title
 * @param excludeId - Page ID to exclude from uniqueness check (for updates)
 * @returns Promise<string> - Unique slug
 */
const generateUniqueSlug = async (
  title: string,
  excludeId?: string
): Promise<string> => {
  if (!title?.trim()) {
    throw new BadRequestError('Title is required for slug generation');
  }

  const baseSlug = slugify(title.trim(), {
    lower: true,
    strict: true,
    locale: 'vi',
  });
  let uniqueSlug = baseSlug;
  let counter = 1;

  // Check for slug uniqueness
  while (true) {
    const query: any = { pst_slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingPage = await PageModel.findOne(query);
    if (!existingPage) {
      break;
    }

    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

/**
 * Validate page input data
 * @param page - Page data to validate
 * @param isUpdate - Whether this is an update operation
 */
const validatePageInput = (page: IPageAttrs, isUpdate = false) => {
  if (!isUpdate && !page.title?.trim()) {
    throw new BadRequestError('Page title is required');
  }

  if (page.title && typeof page.title !== 'string') {
    throw new BadRequestError('Page title must be a string');
  }

  if (page.content && typeof page.content !== 'string') {
    throw new BadRequestError('Page content must be a string');
  }

  if (page.category && typeof page.category !== 'string') {
    throw new BadRequestError('Page category must be a string');
  }

  if (page.template && typeof page.template !== 'string') {
    throw new BadRequestError('Page template must be a string');
  }

  if (page.excerpt && typeof page.excerpt !== 'string') {
    throw new BadRequestError('Page excerpt must be a string');
  }

  if (page.thumbnail && !isValidObjectId(page.thumbnail)) {
    throw new BadRequestError('Invalid thumbnail ID format');
  }

  if (
    page.views !== undefined &&
    (typeof page.views !== 'number' || page.views < 0)
  ) {
    throw new BadRequestError('Page views must be a non-negative number');
  }
};

const createPage = async (page: IPageAttrs) => {
  // Validate input
  validatePageInput(page);

  const session = await startSession();
  session.startTransaction();

  try {
    // Set default category if not provided
    if (!page.category) {
      page.category = PAGE.CATEGORY.OPTIONS.NONE.slug;
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(page.title);

    // Prepare page data
    const pageData = {
      ...page,
      excerpt: page.excerpt || extractExcerpt(page.content || ''),
      slug,
      views: 0,
    };

    const newPage = await PageModel.build(pageData);
    await session.commitTransaction();

    return getReturnData(await newPage.populate('pst_thumbnail', '-__v'));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get published pages with filtering options
 * @param type - Template type filter
 * @param q - Search query for title and excerpt
 * @param exclude - Page slug to exclude from results
 * @param limit - Maximum number of pages to return
 * @param skip - Number of pages to skip (for pagination)
 * @returns Promise with filtered published pages
 */
const getPublishedPages = async ({
  type,
  q,
  exclude,
  limit,
  skip,
}: {
  type?: string;
  q?: string;
  exclude?: string;
  limit?: number;
  skip?: number;
}) => {
  // Build query object
  const query: any = {
    pst_isPublished: true,
  };

  // Add template filter if provided
  if (type?.trim()) {
    query.pst_template = type.trim();
  }

  // Add search filter if provided
  if (q?.trim()) {
    const searchRegex = { $regex: q.trim(), $options: 'i' };
    query.$or = [{ pst_title: searchRegex }, { pst_excerpt: searchRegex }];
  }

  // Add exclude filter if provided
  if (exclude?.trim()) {
    query.pst_slug = { $ne: exclude.trim() };
  }

  // Validate limit and skip parameters
  const queryLimit = validateLimit(limit);
  const querySkip = validateSkip(skip);

  try {
    let queryBuilder = PageModel.find(query, ['-pst_content'])
      .populate('pst_thumbnail', '-__v')
      .sort({ createdAt: -1 });

    // Apply skip if specified
    if (querySkip !== undefined) {
      queryBuilder = queryBuilder.skip(querySkip);
    }

    // Apply limit if specified
    if (queryLimit !== undefined) {
      queryBuilder = queryBuilder.limit(queryLimit);
    }

    const pages = await queryBuilder.lean();
    return getReturnList(pages);
  } catch (error) {
    throw new InternalServerError('Failed to fetch published pages');
  }
};

/**
 * Get all pages with query filtering
 * @param query - Query object with filtering options (supports exclude, limit, and skip parameters)
 * @returns Promise with filtered pages
 */
const getAllPages = async (query: any) => {
  try {
    const sanitizedQuery = removeNestedNullish(query) || {};

    // Handle special parameters separately
    const { exclude, limit, skip, ...restQuery } = sanitizedQuery as {
      exclude?: string;
      limit?: number;
      skip?: number;
      [key: string]: any;
    };

    // Format the rest of the query with PREFIX
    const formattedQuery: any = formatAttributeName(restQuery, PAGE.PREFIX);

    // Add exclude condition if provided
    if (exclude?.trim()) {
      const excludeSlug = exclude.trim();
      formattedQuery.pst_slug = { $ne: excludeSlug };
    }

    // Validate limit and skip parameters
    const queryLimit = validateLimit(limit);
    const querySkip = validateSkip(skip);

    let queryBuilder = PageModel.find(formattedQuery, ['-pst_content'])
      .populate('pst_thumbnail', '-__v')
      .sort({ createdAt: -1 });

    // Apply skip if specified
    if (querySkip !== undefined) {
      queryBuilder = queryBuilder.skip(querySkip);
    }

    // Apply limit if specified
    if (queryLimit !== undefined) {
      queryBuilder = queryBuilder.limit(queryLimit);
    }

    const pages = await queryBuilder.lean();
    return getReturnList(pages);
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError('Failed to fetch pages');
  }
};

/**
 * Get unpublished pages with optional limit and skip
 * @param limit - Maximum number of pages to return
 * @param skip - Number of pages to skip (for pagination)
 * @returns Promise with unpublished pages
 */
const getUnpublishedPages = async (limit?: number, skip?: number) => {
  // Validate limit and skip parameters
  const queryLimit = validateLimit(limit);
  const querySkip = validateSkip(skip);

  try {
    let queryBuilder = PageModel.find({ pst_isPublished: false })
      .populate('pst_thumbnail', '-__v')
      .sort({ createdAt: -1 });

    // Apply skip if specified
    if (querySkip !== undefined) {
      queryBuilder = queryBuilder.skip(querySkip);
    }

    // Apply limit if specified
    if (queryLimit !== undefined) {
      queryBuilder = queryBuilder.limit(queryLimit);
    }

    const pages = await queryBuilder.lean();
    return getReturnList(pages);
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError('Failed to fetch unpublished pages');
  }
};

const getPostDetail = async (id: string) => {
  if (!id?.trim()) {
    throw new BadRequestError('Page ID or slug is required');
  }

  let page;
  const trimmedId = id.trim();

  try {
    if (isValidObjectId(trimmedId)) {
      // Search by ObjectId
      page = await PageModel.findById(trimmedId)
        .populate('pst_thumbnail', '-__v')
        .lean();
    } else {
      // Search by slug
      page = await PageModel.findOne({ pst_slug: trimmedId })
        .populate('pst_thumbnail', '-__v')
        .lean();
    }

    if (!page) {
      throw new NotFoundError('Page not found');
    }

    return getReturnData(page, { without: ['__v'] });
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError('Failed to fetch page details');
  }
};

const updatePage = async (id: string, page: IPageAttrs) => {
  if (!id?.trim()) {
    throw new BadRequestError('Page ID is required');
  }

  if (!isValidObjectId(id.trim())) {
    throw new BadRequestError('Invalid page ID format');
  }

  // Validate input
  validatePageInput(page, true);

  const session = await startSession();
  session.startTransaction();

  try {
    // Remove views from update data to prevent manipulation
    delete page.views;

    // Prepare update data
    const updateData: any = {
      ...removeNestedNullish({
        ...page,
        excerpt:
          page.excerpt ||
          (page.content ? extractExcerpt(page.content) : undefined),
      }),
    };

    // Generate new slug if title is being updated
    if (page.title?.trim()) {
      updateData.slug = await generateUniqueSlug(page.title.trim(), id.trim());
    }

    // Format attribute names
    const formattedUpdateData = formatAttributeName(updateData, PAGE.PREFIX);

    const updatedPage = await PageModel.findByIdAndUpdate(
      id.trim(),
      formattedUpdateData,
      {
        new: true,
        runValidators: true,
        session,
      }
    ).populate('pst_thumbnail', '-__v');

    if (!updatedPage) {
      throw new NotFoundError('Page not found');
    }

    await session.commitTransaction();
    return getReturnData(updatedPage);
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError('Failed to update page');
  } finally {
    session.endSession();
  }
};

const increasePageViews = async (id: string) => {
  if (!id?.trim()) {
    throw new BadRequestError('Page ID is required');
  }

  if (!isValidObjectId(id.trim())) {
    throw new BadRequestError('Invalid page ID format');
  }

  try {
    const result = await PageModel.findByIdAndUpdate(
      id.trim(),
      { $inc: { pst_views: 1 } },
      { new: true, lean: true }
    );

    if (!result) {
      throw new NotFoundError('Page not found');
    }

    return {
      message: 'Page views increased successfully',
      views: result.pst_views,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError('Failed to increase page views');
  }
};

const deletePage = async (id: string) => {
  if (!id?.trim()) {
    throw new BadRequestError('Page ID is required');
  }

  if (!isValidObjectId(id.trim())) {
    throw new BadRequestError('Invalid page ID format');
  }

  try {
    const deletedPage = await PageModel.findByIdAndDelete(id.trim()).lean();

    if (!deletedPage) {
      throw new NotFoundError('Page not found');
    }

    return getReturnData(deletedPage);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError('Failed to delete page');
  }
};

/**
 * Bulk delete pages by IDs
 * @param ids - Array of page IDs to delete
 * @returns Promise with deletion result
 */
const bulkDeletePages = async (ids: string[]) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new BadRequestError('Page IDs array is required');
  }

  // Validate all IDs
  const trimmedIds = ids.map((id) => id?.trim()).filter(Boolean);
  if (trimmedIds.length !== ids.length) {
    throw new BadRequestError('All page IDs must be valid strings');
  }

  const invalidIds = trimmedIds.filter((id) => !isValidObjectId(id));
  if (invalidIds.length > 0) {
    throw new BadRequestError('Invalid page ID format detected');
  }

  const session = await startSession();
  session.startTransaction();

  try {
    const result = await PageModel.deleteMany({
      _id: { $in: trimmedIds },
    }).session(session);

    if (result.deletedCount === 0) {
      throw new NotFoundError('No pages found to delete');
    }

    await session.commitTransaction();
    return {
      message: `Successfully deleted ${result.deletedCount} page(s)`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError('Failed to bulk delete pages');
  } finally {
    session.endSession();
  }
};

export {
  createPage,
  getPublishedPages,
  getAllPages,
  getUnpublishedPages,
  getPostDetail,
  updatePage,
  deletePage,
  increasePageViews,
  bulkDeletePages,
  generateUniqueSlug,
  validatePageInput,
  validateLimit,
  validateSkip,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
};
