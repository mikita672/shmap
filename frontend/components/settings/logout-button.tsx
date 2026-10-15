import { Button, type ButtonProps } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@/lib/icons";

export interface LogoutButtonProps extends Omit<
  ButtonProps,
  "variant" | "size" | "children"
> {
  label?: string;
}

export function LogoutButton({
  label = "Log out",
  ...props
}: LogoutButtonProps) {
  return (
    <Button variant="destructive" size="xl" {...props}>
      <MaterialIcons name="logout" size={24} className="text-white" />
      <Text className="font-medium">{label}</Text>
    </Button>
  );
}
