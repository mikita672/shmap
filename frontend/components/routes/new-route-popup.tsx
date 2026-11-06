import { NewRouteForm } from "@/components/routes/new-route-form";
import { Popup } from "@/components/ui/popup";
import { useCreateRoute } from "@/hooks/useRouteMutations";
import type { ChatResponse, RouteResponse } from "@/lib/types/api";

export interface NewRoutePopupProps {
  chat: ChatResponse;
  visible: boolean;
  onClose: () => void;
  onCreated: (route: RouteResponse) => void;
}

export function NewRoutePopup({
  chat,
  visible,
  onClose,
  onCreated,
}: NewRoutePopupProps) {
  const createRoute = useCreateRoute(chat.id);

  const handleClose = () => {
    if (!createRoute.isPending) onClose();
  };

  return (
    <Popup visible={visible} onClose={handleClose}>
      <NewRouteForm
        description={getNewRouteDescription(chat)}
        isPending={createRoute.isPending}
        onSubmit={(data) => createRoute.mutate(data, { onSuccess: onCreated })}
        onCancel={handleClose}
      />
    </Popup>
  );
}

export function getNewRouteDescription(chat: ChatResponse) {
  if (chat.type === "GROUP") {
    return `Everyone in ${chat.name} can add places and change the route.`;
  }
  const other = chat.members[0];
  return other
    ? `You and ${other.firstName} can add places and change the route.`
    : "Everyone in this chat can add places and change the route.";
}
