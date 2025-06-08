import { z } from 'zod';
import { IBookingAttrs } from '../interfaces/booking.interface';
import { isValidObjectId } from 'mongoose';

export const bookingCreateSchema = z.object<Record<keyof IBookingAttrs, any>>({
  branch: z.string().refine((v) => isValidObjectId(v), {
    message: 'Chi nhánh không hợp lệ.',
  }),
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
  spaName: z
    .string()
    .trim()
    .min(1, { message: 'Tên spa không được để trống.' })
    .max(100, { message: 'Vui lòng viết tên Spa ngắn hơn.' }),
  note: z
    .string()
    .trim()
    .min(1, { message: 'Ghi chú không được để trống.' })
    .max(500, { message: 'Vui lòng viết ghi chú ngắn hơn.' }),
  viewed: z.boolean().default(false).optional(),
});
