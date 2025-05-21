import { z } from 'zod';
import { IReviewAttrs } from '../interfaces/review.interface';
import { isValidObjectId } from 'mongoose';

/* ------------------------------------------------------------------ */
/* Main ReviewAttrs schema                                            */
/* ------------------------------------------------------------------ */

export const reviewCreateSchema = z.object<Record<keyof IReviewAttrs, any>>({
  /* RELATIONS */
  spa: z
    .string()
    // .nonempty({ message: 'Spa ID is required' })
    .refine((v) => v && v.trim().length > 0, {
      message: 'Spa ID cannot be empty',
    })
    .refine((v) => isValidObjectId(v), {
      message: 'Invalid spa ID',
    }),
  author: z.string().refine((v) => isValidObjectId(v), {
    message: 'Invalid author ID',
  }),

  /* CONTENT */
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional(),
  content: z.string().trim().min(10).max(2000),
  images: z
    .array(
      z.string().refine((v) => isValidObjectId(v), {
        message: 'Invalid image ID',
      })
    )
    .max(5)
    .optional(),

  /* META */
  likes: z.number().int().nonnegative().optional(),
  isApproved: z.boolean().default(false).optional(),
});

/* ------------------------------------------------------------------ */
/* Review update schema (for partial updates)                         */
/* ------------------------------------------------------------------ */

export const reviewUpdateSchema = reviewCreateSchema
  .partial()
  .omit({ spa: true, author: true }); // These fields shouldn't be updateable

/* ------------------------------------------------------------------ */
/* Search/Filter schema                                               */
/* ------------------------------------------------------------------ */

export const reviewSearchSchema = z
  .object({
    spa: z.string().optional(),
    author: z.string().optional(),
    isApproved: z.boolean().optional(),
    minRating: z.number().int().min(1).max(5).optional(),
    maxRating: z.number().int().min(1).max(5).optional(),
    page: z.number().int().positive().default(1).optional(),
    limit: z.number().int().positive().max(100).default(10).optional(),
    sortBy: z
      .enum(['createdAt', 'rating', 'likes'])
      .default('createdAt')
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  })
  .refine(
    (data) => {
      // If both min and max rating are provided, max should be >= min
      if (data.minRating && data.maxRating) {
        return data.maxRating >= data.minRating;
      }
      return true;
    },
    {
      message: 'maxRating must be greater than or equal to minRating',
      path: ['maxRating'],
    }
  );
