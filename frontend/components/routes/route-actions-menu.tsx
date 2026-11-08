import { useState } from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { ConfirmCard } from "@/components/ui/confirm-card";
import { Popup } from "@/components/ui/popup";
import { RoundButton } from "@/components/ui/round-button";
import { Separator } from "@/components/ui/separator";
import { SheetItem } from "@/components/ui/sheet-item";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { useProfile } from "@/hooks/useProfile";
import { useDeleteRoute, useRenameRoute } from "@/hooks/useRouteMutations";
import { MaterialIcons } from "@/lib/icons";
import { formatStopCount, joinMeta } from "@/lib/route-format";
import type { ChatResponse, RouteResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const STEP_ENTERING = FadeIn.duration(200);
const MAX_NAME_LENGTH = 50;

type MenuStep = "menu" | "rename" | "delete";

export interface RouteActionsMenuProps {
  route: RouteResponse;
  chat?: ChatResponse;
  visible: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function RouteActionsMenu({
  route,
  chat,
  visible,
  onClose,
  onDeleted,
}: RouteActionsMenuProps) {
  const { data: profile } = useProfile();
  const rename = useRenameRoute(route.id);
  const remove = useDeleteRoute(route.id);
  const [step, setStep] = useState<MenuStep>("menu");
  const [name, setName] = useState(route.name);
  const trimmedName = name.trim();
  const creator =
    route.createdBy.id === profile?.id ? "you" : route.createdBy.firstName;

  const handleClose = () => {
    if (!rename.isPending && !remove.isPending) onClose();
  };

  const handleAllRoutes = () => {
    onClose();
    router.push({
      pathname: "/chat/[chatId]/routes",
      params: { chatId: String(route.chatId) },
    });
  };

  const handleSave = () => {
    if (!trimmedName || rename.isPending) return;
    if (trimmedName === route.name) {
      onClose();
      return;
    }
    rename.mutate(trimmedName, { onSuccess: onClose });
  };

  if (step === "delete") {
    return (
      <Popup visible={visible} onClose={handleClose}>
        <Animated.View entering={STEP_ENTERING}>
          <ConfirmCard
            icon="delete"
            title={`Delete ${route.name}?`}
            message={getDeleteMessage(chat)}
            confirmLabel="Delete route"
            pendingLabel="Deleting…"
            isPending={remove.isPending}
            onConfirm={() =>
              remove.mutate(route.chatId, {
                onSuccess: () => {
                  onClose();
                  onDeleted();
                },
              })
            }
            onCancel={handleClose}
          />
        </Animated.View>
      </Popup>
    );
  }

  if (step === "rename") {
    return (
      <Popup visible={visible} onClose={handleClose}>
        <Animated.View
          entering={STEP_ENTERING}
          className="items-center px-6 pb-6 pt-8"
        >
          <RouteIcon />

          <View className="w-full items-center gap-2 pb-5 pt-4">
            <Text className="text-center text-[22px] text-card-title">
              Rename route
            </Text>
            <Text className="text-center text-sm leading-5 text-card-muted">
              {getRenameMessage(chat)}
            </Text>
          </View>

          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            maxLength={MAX_NAME_LENGTH}
            autoFocus
            selectTextOnFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
            editable={!rename.isPending}
            containerClassName="w-full pb-6"
          />

          <View className="w-full gap-2">
            <Button
              size="xl"
              className="w-full"
              disabled={!trimmedName || rename.isPending}
              onPress={handleSave}
            >
              <Text className="text-2xl">
                {rename.isPending ? "Saving…" : "Save"}
              </Text>
            </Button>
            <Button
              variant="secondary"
              size="xl"
              className="w-full"
              disabled={rename.isPending}
              onPress={handleClose}
            >
              <Text className="text-xl">Cancel</Text>
            </Button>
          </View>
        </Animated.View>
      </Popup>
    );
  }

  return (
    <Popup visible={visible} onClose={onClose} className="pb-3 pt-6">
      <View className="items-center gap-1 px-6 pb-4">
        <RouteIcon className="mb-1" />
        <Text
          numberOfLines={2}
          className="text-center text-xl leading-7 tracking-[0.5px] text-card-title"
        >
          {route.name}
        </Text>
        <Text className="text-center text-sm leading-5 tracking-[0.5px] text-card-muted">
          {joinMeta(
            `Created by ${creator}`,
            formatStopCount(route.stops.length),
          )}
        </Text>
      </View>

      <MenuDivider />
      {route.canEdit && (
        <SheetItem label="Rename" onPress={() => setStep("rename")} />
      )}
      <SheetItem label="All routes in this chat" onPress={handleAllRoutes} />
      {route.canEdit && (
        <>
          <MenuDivider />
          <SheetItem
            label="Delete route"
            tone="danger"
            onPress={() => setStep("delete")}
          />
        </>
      )}

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

function RouteIcon({ className }: { className?: string }) {
  return (
    <View
      className={cn(
        "h-14 w-14 items-center justify-center rounded-full bg-action",
        className,
      )}
    >
      <MaterialIcons
        name="route"
        size={28}
        className="text-action-foreground"
      />
    </View>
  );
}

function MenuDivider() {
  return (
    <View className="px-6 py-1">
      <Separator className="bg-card-divider/40" />
    </View>
  );
}

function getRenameMessage(chat?: ChatResponse) {
  if (chat?.type === "GROUP") {
    return `The new name shows for everyone in ${chat.name}.`;
  }
  const other = chat?.members[0];
  return other
    ? `The new name shows for you and ${other.firstName}.`
    : "The new name shows for everyone in this chat.";
}

function getDeleteMessage(chat?: ChatResponse) {
  if (chat?.type === "GROUP") {
    return `It's deleted for everyone in ${chat.name}.`;
  }
  const other = chat?.members[0];
  return other
    ? `It's deleted for you and ${other.firstName}.`
    : "It's deleted for everyone in this chat.";
}
