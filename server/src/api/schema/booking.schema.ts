import { z } from 'zod';
import { IBookingAttrs } from '../interfaces/booking.interface';
import { isValidObjectId } from 'mongoose';

export const bookingCreateSchema = z.object<Record<keyof IBookingAttrs, any>>({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Tên không được để trống.' })
    .max(100, { message: 'Vui lòng điền tên ngắn hơn.' }),
  msisdn: z
    .string()
    .trim()
    .min(10, { message: 'Số điện thoại không được để trống.' })
    .max(15, { message: 'Số điện thoại không được quá dài.' })
    .refine((v) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(v), {
      message: 'Số điện thoại không hợp lệ.',
    }),
  courseName: z
    .string()
    .trim()
    .min(1, { message: 'Tên khóa học không được để trống.' })
    .max(100, { message: 'Vui lòng điền tên khóa học ngắn hơn.' }),
  courseLevel: z
    .string()
    .trim()
    .min(1, { message: 'Trình độ khóa học không được để trống.' })
    .max(50, { message: 'Vui lòng điền trình độ khóa học ngắn hơn.' }),
  note: z
    .string()
    .trim()
    .max(500, { message: 'Vui lòng viết ghi chú ngắn hơn.' })
    .optional(),
  viewed: z.boolean().default(false).optional(),
});
