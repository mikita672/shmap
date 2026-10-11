export interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type PasswordChangeField = keyof PasswordChangeValues;

export type PasswordChangeErrors = Partial<Record<PasswordChangeField, string>>;

export const PASSWORD_LIMITS = {
  minLength: 8,
  maxLength: 72,
} as const;

export function validatePasswordChange(
  values: PasswordChangeValues,
): PasswordChangeErrors {
  const { currentPassword, newPassword, confirmPassword } = values;
  const errors: PasswordChangeErrors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required";
  } else if (
    newPassword.length < PASSWORD_LIMITS.minLength ||
    newPassword.length > PASSWORD_LIMITS.maxLength
  ) {
    errors.newPassword = `New password must be between ${PASSWORD_LIMITS.minLength} and ${PASSWORD_LIMITS.maxLength} characters`;
  } else if (newPassword === currentPassword) {
    errors.newPassword =
      "New password must be different from the current password";
  }

  if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
