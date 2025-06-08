import { ICandidateUpdate } from '@/api/interfaces/candidate.interface';
import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const candidateCreateSchema = z.object<
  Record<keyof ICandidateUpdate, any>
>({
  msisdn: z
    .string()
    .trim()
    .min(10, { message: 'Số điện thoại không được để trống.' })
    .max(15, { message: 'Số điện thoại không được quá dài.' })
    .refine((v) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(v), {
      message: 'Số điện thoại không hợp lệ.',
    }),

  // User fields
  username: z
    .string()
    .trim()
    .min(3, { message: 'Tên người dùng không được để trống.' }),
  email: z.string().trim().email({ message: 'Email không hợp lệ.' }).optional(),
  firstName: z.string().trim().min(1, { message: 'Tên không được để trống.' }),
  lastName: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  address: z.string().trim().optional(),
  birthdate: z.string().trim().optional(),
  sex: z.string().trim().optional(),
  status: z.string().trim().optional(),
  avatar: z
    .string()
    .trim()
    .refine((value) => !value || isValidObjectId(value), {
      message: 'Avatar không hợp lệ.',
    })
    .optional(),
  role: z
    .string()
    .trim()
    .refine((value) => !value || isValidObjectId(value), {
      message: 'Vai trò không hợp lệ.',
    })
    .optional(),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    .optional(),

  // Candidate fields
  summary: z.string().trim().optional(),
  experience: z.string().trim().optional(),
  skills: z.array(z.string()).optional(),
  cvFile: z.string().trim().optional(),
});

// Validation schema for updating candidate
export const candidateUpdateSchema = candidateCreateSchema.partial();
