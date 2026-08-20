import { cn } from "@/lib/utils";
import { Platform, TextInput } from "react-native";

function Input({
  className,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "bg-surface text-on-surface border-muted/30 flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9",
        props.editable === false &&
          cn(
            "opacity-50",
            Platform.select({
              web: "disabled:pointer-events-none disabled:cursor-not-allowed",
            }),
          ),
        Platform.select({
          web: cn(
            "placeholder:text-on-surface-muted selection:bg-accent selection:text-surface outline-none transition-[color,box-shadow] md:text-sm",
            "focus-visible:border-accent focus-visible:ring-accent/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
          native: "placeholder:text-on-surface-muted",
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Input };
