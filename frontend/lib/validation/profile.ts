export interface EditableProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
}

export type ProfileTextField = Exclude<keyof EditableProfile, "avatarUrl">;

export type ProfileFieldErrors = Partial<Record<ProfileTextField, string>>;

export const PROFILE_LIMITS = {
  nameMaxLength: 50,
  usernameMinLength: 3,
  usernameMaxLength: 30,
  bioMaxLength: 160,
} as const;

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators: Record<
  ProfileTextField,
  (value: string) => string | undefined
> = {
  firstName: (value) => {
    if (!value) return "First name is required";
    if (value.length > PROFILE_LIMITS.nameMaxLength)
      return `First name must be at most ${PROFILE_LIMITS.nameMaxLength} characters`;
  },
  lastName: (value) => {
    if (!value) return "Last name is required";
    if (value.length > PROFILE_LIMITS.nameMaxLength)
      return `Last name must be at most ${PROFILE_LIMITS.nameMaxLength} characters`;
  },
  username: (value) => {
    if (!value) return "Username is required";
    if (
      value.length < PROFILE_LIMITS.usernameMinLength ||
      value.length > PROFILE_LIMITS.usernameMaxLength
    )
      return `Username must be between ${PROFILE_LIMITS.usernameMinLength} and ${PROFILE_LIMITS.usernameMaxLength} characters`;
    if (!USERNAME_PATTERN.test(value))
      return "Username can only contain letters, numbers, underscores, dots, or hyphens";
  },
  email: (value) => {
    if (!value) return "Email is required";
    if (!EMAIL_PATTERN.test(value))
      return "Please provide a valid email address";
  },
  bio: (value) => {
    if (value.length > PROFILE_LIMITS.bioMaxLength)
      return `Bio must be at most ${PROFILE_LIMITS.bioMaxLength} characters`;
  },
};

export function validateProfileField(
  field: ProfileTextField,
  value: string,
): string | undefined {
  return validators[field](value.trim());
}

export function validateProfile(values: EditableProfile): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  for (const field of Object.keys(validators) as ProfileTextField[]) {
    const error = validateProfileField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

const SERVER_FIELD_MAP: Record<string, ProfileTextField> = {
  firstname: "firstName",
  lastname: "lastName",
  firstName: "firstName",
  lastName: "lastName",
  username: "username",
  email: "email",
  bio: "bio",
};

export function mapServerProfileErrors(
  fieldErrors: Record<string, string> | undefined,
): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  for (const [key, message] of Object.entries(fieldErrors ?? {})) {
    const field = SERVER_FIELD_MAP[key];
    if (field) errors[field] = message;
  }
  return errors;
}
