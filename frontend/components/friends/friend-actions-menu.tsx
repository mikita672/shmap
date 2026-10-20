import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Avatar } from "@/components/ui/avatar";
import { Popup } from "@/components/ui/popup";
import { RoundButton } from "@/components/ui/round-button";
import { Separator } from "@/components/ui/separator";
import { SheetItem } from "@/components/ui/sheet-item";
import { Text } from "@/components/ui/text";
import { shareProfile } from "@/lib/profile-link";
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
  const fullName = `${user.firstName} ${user.lastName}`;

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await shareProfile(user.username, fullName);
    } catch {
      toast.error("Couldn't open the share dialog");
    }
    onClose();
  };

  return (
    <Popup visible={visible} onClose={onClose} className="pt-6 pb-3">
      <View className="items-center gap-1 px-6 pb-4">
        <Avatar uri={user.avatarUrl} size={56} />
        <Text className="text-center text-xl leading-7 tracking-[0.5px] text-card-title">
          {fullName}
        </Text>
        <Text className="text-center text-sm leading-5 tracking-[0.5px] text-card-muted">
          @{user.username}
        </Text>
      </View>

      <MenuDivider />
      {person.isFriend && (
        <>
          <SheetItem
            label={
              person.favorite ? "Remove from favorites" : "Add to favorites"
            }
            disabled
          />
          <SheetItem label="Add to group" disabled />
          <SheetItem
            label={person.muted ? "Unmute routes" : "Mute routes"}
            disabled
          />
        </>
      )}
      <SheetItem label="Share profile" onPress={handleShare} />
      <MenuDivider />
      {person.isFriend && (
        <SheetItem label="Remove friend" tone="danger" disabled />
      )}
      <SheetItem label="Block" tone="danger" disabled />

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

function MenuDivider() {
  return (
    <View className="px-6 py-1">
      <Separator className="bg-card-divider/40" />
    </View>
  );
}
