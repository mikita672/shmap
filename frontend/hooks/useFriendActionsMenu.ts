import { useState } from "react";
import { Keyboard } from "react-native";
import type { FriendActionsPerson } from "@/components/friends/friend-actions-menu";

export function useFriendActionsMenu() {
  const [person, setPerson] = useState<FriendActionsPerson | null>(null);
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  const open = (next: FriendActionsPerson) => {
    Keyboard.dismiss();
    setKey((current) => current + 1);
    setPerson(next);
    setVisible(true);
  };

  const close = () => setVisible(false);

  return { key, person, visible, open, close };
}
