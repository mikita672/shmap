import { useState } from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmCard } from "@/components/ui/confirm-card";
import { Popup } from "@/components/ui/popup";
import { RoundButton } from "@/components/ui/round-button";
import { Separator } from "@/components/ui/separator";
import { SheetItem } from "@/components/ui/sheet-item";
import { Text } from "@/components/ui/text";
import { useBlockUser } from "@/hooks/useBlockMutations";
import {
  useRemoveFriend,
  useSetFavorite,
  useSetMuted,
} from "@/hooks/useFriendMutations";
import { shareProfile } from "@/lib/profile-link";
import type { UserSummaryResponse } from "@/lib/types/api";

export interface FriendActionsPerson {
  user: UserSummaryResponse;
  isFriend: boolean;
  favorite: boolean;
  muted: boolean;
}

type MenuStep = "menu" | "remove" | "block";

const CONFIRM_ENTERING = FadeIn.duration(200);

export interface FriendActionsMenuProps {
  person: FriendActionsPerson;
  visible: boolean;
  onClose: () => void;
  onBlocked?: () => void;
}

export function FriendActionsMenu({
  person,
  visible,
  onClose,
  onBlocked,
}: FriendActionsMenuProps) {
  const { user } = person;
  const fullName = `${user.firstName} ${user.lastName}`;
  const setFavorite = useSetFavorite();
  const setMuted = useSetMuted();
  const remove = useRemoveFriend();
  const block = useBlockUser();
  const [step, setStep] = useState<MenuStep>("menu");

  const handleClose = () => {
    if (!remove.isPending && !block.isPending) onClose();
  };

  const handleToggleFavorite = () => {
    setFavorite.mutate({ friendId: user.id, favorite: !person.favorite });
    onClose();
  };

  const handleToggleMuted = () => {
    setMuted.mutate({ friend: user, muted: !person.muted });
    onClose();
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await shareProfile(user.username, fullName);
    } catch {
      toast.error("Couldn't open the share dialog");
    }
    onClose();
  };

  if (step === "remove") {
    return (
      <Popup visible={visible} onClose={handleClose}>
        <Animated.View entering={CONFIRM_ENTERING}>
          <ConfirmCard
            icon="person-remove"
            title={`Remove ${user.firstName}?`}
            message={`${user.firstName} will be removed from your friends and won't be notified. You can send a new request later.`}
            confirmLabel="Remove"
            pendingLabel="Removing…"
            isPending={remove.isPending}
            onConfirm={() => remove.mutate(user.id, { onSuccess: onClose })}
            onCancel={handleClose}
          />
        </Animated.View>
      </Popup>
    );
  }

  if (step === "block") {
    const message = `${user.firstName} won't be able to find you, see your profile or send you requests, and won't be notified`;

    return (
      <Popup visible={visible} onClose={handleClose}>
        <Animated.View entering={CONFIRM_ENTERING}>
          <ConfirmCard
            icon="block"
            title={`Block ${user.firstName}?`}
            message={
              person.isFriend
                ? `${message} This also removes ${user.firstName} from your friends`
                : message
            }
            confirmLabel="Block"
            pendingLabel="Blocking…"
            isPending={block.isPending}
            onConfirm={() =>
              block.mutate(user, {
                onSuccess: () => {
                  onClose();
                  onBlocked?.();
                },
              })
            }
            onCancel={handleClose}
          />
        </Animated.View>
      </Popup>
    );
  }

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
            onPress={handleToggleFavorite}
          />
          <SheetItem label="Add to group" disabled />
          <SheetItem
            label={person.muted ? "Unmute routes" : "Mute routes"}
            onPress={handleToggleMuted}
          />
        </>
      )}
      <SheetItem label="Share profile" onPress={handleShare} />
      <MenuDivider />
      {person.isFriend && (
        <SheetItem
          label="Remove friend"
          tone="danger"
          onPress={() => setStep("remove")}
        />
      )}
      <SheetItem label="Block" tone="danger" onPress={() => setStep("block")} />

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
