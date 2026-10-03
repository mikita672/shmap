import { useState } from "react";
import {
  mapServerProfileErrors,
  validateProfile,
  type EditableProfile,
  type ProfileFieldErrors,
  type ProfileTextField,
} from "@/lib/validation/profile";

export type ProfileChanges = Partial<EditableProfile>;

function getChanges(
  initial: EditableProfile,
  values: EditableProfile,
): ProfileChanges {
  const changes: ProfileChanges = {};
  for (const key of Object.keys(values) as (keyof EditableProfile)[]) {
    const next = values[key];
    const normalized = typeof next === "string" ? next.trim() : next;
    if (normalized !== initial[key]) {
      Object.assign(changes, { [key]: normalized });
    }
  }
  return changes;
}

export function useEditProfileForm(initial: EditableProfile) {
  const [values, setValues] = useState<EditableProfile>(initial);
  const [touched, setTouched] = useState<Set<ProfileTextField>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverErrors, setServerErrorsState] = useState<ProfileFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientErrors = validateProfile(values);
  const changes = getChanges(initial, values);
  const isDirty = Object.keys(changes).length > 0;
  const isValid = Object.keys(clientErrors).length === 0;

  const errors: ProfileFieldErrors = {};
  for (const field of Object.keys(values) as ProfileTextField[]) {
    const showClientError = submitAttempted || touched.has(field);
    const error =
      serverErrors[field] ??
      (showClientError ? clientErrors[field] : undefined);
    if (error) errors[field] = error;
  }

  const setField = <K extends keyof EditableProfile>(
    field: K,
    value: EditableProfile[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerErrorsState((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field as ProfileTextField];
      return next;
    });
  };

  const markTouched = (field: ProfileTextField) => {
    setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)));
  };

  const setServerErrors = (fieldErrors: Record<string, string> | undefined) => {
    setServerErrorsState(mapServerProfileErrors(fieldErrors));
  };

  const handleSubmit = async (
    onSubmit: (changes: ProfileChanges) => Promise<void> | void,
  ): Promise<boolean> => {
    setSubmitAttempted(true);
    if (!isValid || !isDirty || isSubmitting) return false;

    setIsSubmitting(true);
    try {
      await onSubmit(changes);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    changes,
    isDirty,
    isValid,
    isSubmitting,
    setField,
    markTouched,
    setServerErrors,
    handleSubmit,
  };
}
