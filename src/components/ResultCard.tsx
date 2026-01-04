import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

export function ResultCard({ label, value, unit, highlight, icon }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-xl p-4 border-2 shadow-card",
        highlight ? "border-accent" : "border-border"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "measurement-display text-2xl",
          highlight ? "text-accent" : "text-foreground"
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
    </motion.div>
  );
}
