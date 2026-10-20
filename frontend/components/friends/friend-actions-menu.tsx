import { View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Popup } from "@/components/ui/popup";
import { RoundButton } from "@/components/ui/round-button";
import { Text } from "@/components/ui/text";
import type { UserSummaryResponse } from "@/lib/types/api";

export interface FriendActionsPerson {
  user: UserSummaryResponse;
  isFriend: boolean;
  favorite: boolean;
  muted: boolean;
}

export interface FriendActionsMenuProps {
  person: FriendActionsPerson;
  visible: boolean;
  onClose: () => void;
}

export function FriendActionsMenu({
  person,
  visible,
  onClose,
}: FriendActionsMenuProps) {
  const { user } = person;

  return (
    <Popup visible={visible} onClose={onClose} className="pt-6 pb-3">
      <View className="items-center gap-1 px-6 pb-4">
        <Avatar uri={user.avatarUrl} size={56} />
        <Text className="text-center text-xl leading-7 tracking-[0.5px] text-card-title">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-center text-sm leading-5 tracking-[0.5px] text-card-muted">
          @{user.username}
        </Text>
      </View>

      <RoundButton
        icon="close"
        accessibilityLabel="Close"
        hitSlop={8}
        onPress={onClose}
        className="absolute right-4 top-4"
      />
    </Popup>
  );
}
