import { ThreadType } from "@/lib/pipeData";
import { cn } from "@/lib/utils";

interface ThreadTypeSelectorProps {
  value: ThreadType;
  onChange: (type: ThreadType) => void;
}

const THREAD_TYPES: { value: ThreadType; label: string; description: string }[] = [
  { value: "NPT", label: "NPT", description: "US Standard" },
  { value: "BSP", label: "BSP", description: "British" },
  { value: "Metric", label: "Metric", description: "ISO/DIN" },
];

export function ThreadTypeSelector({ value, onChange }: ThreadTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {THREAD_TYPES.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={cn(
            "flex-1 py-3 px-3 rounded-lg border-2 transition-all duration-200",
            value === type.value
              ? "border-accent bg-accent/10"
              : "border-border bg-card hover:border-accent/50"
          )}
        >
          <div className={cn(
            "font-semibold text-sm",
            value === type.value ? "text-foreground" : "text-muted-foreground"
          )}>
            {type.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {type.description}
          </div>
        </button>
      ))}
    </div>
  );
}
