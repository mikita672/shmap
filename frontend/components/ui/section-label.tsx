import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  title: string;
  className?: string;
}

export function SectionLabel({ title, className }: SectionLabelProps) {
  return (
    <Text
      role="heading"
      className={cn(
        "px-5 text-sm leading-5 tracking-[0.5px] text-secondary",
        className,
      )}
    >
      {title}
    </Text>
  );
}
