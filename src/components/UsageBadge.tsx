import { getRemainingMeasurements, isProUser } from "@/lib/usageStore";
import { Crown } from "lucide-react";

export function UsageBadge() {
  const remaining = getRemainingMeasurements();
  const isPro = isProUser();

  if (isPro) {
    return (
      <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">
        <Crown className="w-4 h-4" />
        PRO
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-warning/10 text-warning px-3 py-1.5 rounded-full text-sm font-medium">
      {remaining}/3 today
    </div>
  );
}
