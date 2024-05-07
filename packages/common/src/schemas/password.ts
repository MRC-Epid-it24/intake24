import { isStrongPassword } from 'validator';
import { z } from 'zod';

export const strongPassword = z.string().refine(val =>
  isStrongPassword(val, {
    minLength: 10,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  }), { message: 'Weak password' });

export const strongPasswordWithConfirm = z.object({
  password: z.string().refine(val =>
    isStrongPassword(val, {
      minLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }), { message: 'Weak password' }),
  passwordConfirm: z.string().refine(val =>
    isStrongPassword(val, {
      minLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  ),
});
