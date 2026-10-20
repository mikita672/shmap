import { useState } from "react";
import { Keyboard } from "react-native";
import type { FriendActionsPerson } from "@/components/friends/friend-actions-menu";

export function useFriendActionsMenu() {
  const [person, setPerson] = useState<FriendActionsPerson | null>(null);
  const [visible, setVisible] = useState(false);

  const open = (next: FriendActionsPerson) => {
    Keyboard.dismiss();
    setPerson(next);
    setVisible(true);
  };

  const close = () => setVisible(false);

  return { person, visible, open, close };
}
