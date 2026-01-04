import { PIPE_MATERIALS, PipeMaterial } from "@/lib/pipeData";
import { cn } from "@/lib/utils";

interface MaterialSelectorProps {
  value: PipeMaterial;
  onChange: (material: PipeMaterial) => void;
}

export function MaterialSelector({ value, onChange }: MaterialSelectorProps) {
  return (
    <div className="flex gap-2">
      {PIPE_MATERIALS.map((material) => (
        <button
          key={material.value}
          onClick={() => onChange(material.value)}
          className={cn(
            "flex-1 py-3 px-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
            value === material.value
              ? "border-accent bg-accent/10 text-foreground"
              : "border-border bg-card text-muted-foreground hover:border-accent/50"
          )}
        >
          <div 
            className="w-4 h-4 rounded-full mx-auto mb-1"
            style={{ backgroundColor: material.color }}
          />
          {material.label}
        </button>
      ))}
    </div>
  );
}
