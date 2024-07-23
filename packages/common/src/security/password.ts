import isStrongPassword from 'validator/lib/isStrongPassword';
import { z } from 'zod';

export const strongPassword = z.string().refine(val =>
  isStrongPassword(val, {
    minLength: 10,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  }), { message: 'Weak password' });

export const strongPasswordOptional = z.string().nullish().transform(val => val ?? undefined).refine((val) => {
  if (!val)
    return true;

  return isStrongPassword(val, {
    minLength: 10,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  });
}, { message: 'Weak password' });

export const strongPasswordWithConfirm = z.object({
  password: strongPassword,
  passwordConfirm: strongPassword,
});

export const strongPasswordWithConfirmOptional = z.object({
  password: strongPasswordOptional,
  passwordConfirm: strongPasswordOptional,
});
