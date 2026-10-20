import { ConfirmCard } from "@/components/ui/confirm-card";
import { Popup } from "@/components/ui/popup";

export interface LogoutDialogProps {
  visible: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutDialog({
  visible,
  isPending = false,
  onConfirm,
  onCancel,
}: LogoutDialogProps) {
  const handleCancel = () => {
    if (!isPending) onCancel();
  };

  return (
    <Popup visible={visible} onClose={handleCancel}>
      <ConfirmCard
        icon="logout"
        title="Log out?"
        message="You will need to sign in again to see your routes and friends."
        confirmLabel="Log out"
        pendingLabel="Logging out…"
        isPending={isPending}
        onConfirm={onConfirm}
        onCancel={handleCancel}
      />
    </Popup>
  );
}
