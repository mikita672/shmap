import { Button, type ButtonProps } from "@/components/ui/button";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type QrCodeButtonProps = Omit<
  ButtonProps,
  "children" | "size" | "variant"
> & {
  accessibilityLabel: string;
};

export function QrCodeButton({ className, ...props }: QrCodeButtonProps) {
  return (
    <Button
      size="icon-xl"
      className={cn("bg-action-accent active:bg-action-accent/80", className)}
      {...props}
    >
      <MaterialIcons
        name="qr-code-2"
        size={36}
        className="text-action-accent-foreground"
      />
    </Button>
  );
}
