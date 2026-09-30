import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  joinedDate: string;
}

export const MOCK_PROFILE: UserProfile = {
  id: "user_01",
  firstName: "Alex",
  lastName: "Rivera",
  username: "alex_rivera",
  email: "alex.rivera@example.com",
  bio: "Mapping favorite spots and discovering adventures 🗺️✨",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  joinedDate: "January 2025",
};

let currentProfile: UserProfile = MOCK_PROFILE;
const listeners = new Set<(profile: UserProfile) => void>();

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);

  useEffect(() => {
    listeners.add(setProfile);
    return () => {
      listeners.delete(setProfile);
    };
  }, []);

  const updateProfile = useCallback(
    (
      changes: Partial<
        Pick<
          UserProfile,
          "firstName" | "lastName" | "username" | "email" | "bio"
        >
      >,
    ) => {
      currentProfile = { ...currentProfile, ...changes };
      listeners.forEach((listener) => listener(currentProfile));
    },
    [],
  );

  const updateAvatar = useCallback((avatarUrl: string | null) => {
    currentProfile = { ...currentProfile, avatarUrl };
    listeners.forEach((listener) => listener(currentProfile));
  }, []);

  return {
    profile,
    updateProfile,
    updateAvatar,
  };
}
