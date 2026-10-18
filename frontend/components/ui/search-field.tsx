import { TextInput, View } from "react-native";
import { MaterialIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type SearchFieldProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput>;

export function SearchField({ className, ...props }: SearchFieldProps) {
  return (
    <View
      className={cn(
        "h-12 flex-row items-center gap-3 rounded-full bg-surface pl-5 pr-4",
        className,
      )}
    >
      <TextInput
        role="searchbox"
        enterKeyHint="search"
        autoCapitalize="none"
        autoCorrect={false}
        className="h-full flex-1 py-0 text-base tracking-[0.5px] text-on-surface placeholder:text-on-surface-muted"
        {...props}
      />
      <MaterialIcons
        name="search"
        size={24}
        className="text-on-surface-muted"
      />
    </View>
  );
}
