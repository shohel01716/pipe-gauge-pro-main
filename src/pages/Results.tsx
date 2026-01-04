import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/ResultCard";
import { MaterialSelector } from "@/components/MaterialSelector";
import { ThreadTypeSelector } from "@/components/ThreadTypeSelector";
import { ThreadPitchMatch } from "@/components/ThreadPitchMatch";
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Ruler, 
  Hash, 
  Wrench,
  RotateCcw,
  Check,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  findClosestPipeSize, 
  getThreadInfo, 
  mmToInches,
  PipeMaterial,
  ThreadType
} from "@/lib/pipeData";
import { saveMeasurement } from "@/lib/measurementStore";
import { isProUser } from "@/lib/usageStore";
import { isQuickFavorite, toggleQuickFavorite } from "@/lib/quickFavorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LocationState {
  diameterMm: number;
  source: "camera" | "manual" | "favorite";
}

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [material, setMaterial] = useState<PipeMaterial>("Steel");
  const [threadType, setThreadType] = useState<ThreadType>("NPT");
  const [isSaved, setIsSaved] = useState(false);

  const isPro = isProUser();
  const diameterMm = state?.diameterMm || 21.3;
  const diameterInches = mmToInches(diameterMm);
  const pipeSize = findClosestPipeSize(diameterMm);
  
  const [isFavorited, setIsFavorited] = useState(
    pipeSize ? isQuickFavorite(pipeSize.nps) : false
  );

  const handleSave = () => {
    if (!isPro) {
      toast.error("Pro feature", {
        description: "Upgrade to save measurements",
        action: {
          label: "Upgrade",
          onClick: () => navigate("/upgrade"),
        },
      });
      return;
    }

    if (pipeSize) {
      saveMeasurement({
        diameterMm,
        diameterInches,
        nps: pipeSize.nps,
        threadType,
        threadInfo: getThreadInfo(pipeSize, threadType),
        material,
        label: "",
        notes: "",
        isFavorite: false,
      });
      setIsSaved(true);
      toast.success("Measurement saved");
    }
  };

  const handleToggleFavorite = () => {
    if (!isPro) {
      toast.error("Pro feature", {
        description: "Upgrade to add Quick Favorites",
        action: {
          label: "Upgrade",
          onClick: () => navigate("/upgrade"),
        },
      });
      return;
    }

    if (pipeSize) {
      const nowFavorited = toggleQuickFavorite(
        pipeSize.nps,
        pipeSize.odMm,
        mmToInches(pipeSize.odMm)
      );
      setIsFavorited(nowFavorited);
      toast.success(
        nowFavorited 
          ? `${pipeSize.nps}" added to Quick Favorites` 
          : `${pipeSize.nps}" removed from Quick Favorites`
      );
    }
  };

  const handleShare = () => {
    if (!isPro) {
      toast.error("Pro feature", {
        description: "Upgrade to export results",
        action: {
          label: "Upgrade",
          onClick: () => navigate("/upgrade"),
        },
      });
      return;
    }
    
    toast.info("Export feature coming soon");
  };

  if (!state) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Results</h1>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggleFavorite}
            className={cn(isFavorited && "text-warning")}
          >
            <Star className={cn("w-5 h-5", isFavorited && "fill-warning")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button 
            variant={isSaved ? "accent" : "ghost"}
            size="icon"
            onClick={handleSave}
          >
            {isSaved ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="px-5 pb-28 space-y-5">
        {/* Primary Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary rounded-2xl p-6 text-center shadow-tool relative overflow-hidden"
        >
          {isFavorited && (
            <div className="absolute top-3 right-3">
              <Star className="w-5 h-5 text-warning fill-warning" />
            </div>
          )}
          <div className="text-primary-foreground/70 text-sm font-medium mb-2">
            NOMINAL PIPE SIZE
          </div>
          <div className="measurement-display text-5xl text-primary-foreground mb-2">
            {pipeSize?.nps || "—"}
          </div>
          <div className="text-primary-foreground/70 text-sm">
            NPS (Nominal Pipe Size)
          </div>
        </motion.div>

        {/* Measurements Grid */}
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="Diameter"
            value={diameterMm.toFixed(1)}
            unit="mm"
            highlight
            icon={<Ruler className="w-4 h-4" />}
          />
          <ResultCard
            label="Diameter"
            value={diameterInches.toFixed(3)}
            unit="in"
            icon={<Ruler className="w-4 h-4" />}
          />
          <ResultCard
            label="Thread"
            value={pipeSize ? getThreadInfo(pipeSize, threadType) : "—"}
            icon={<Hash className="w-4 h-4" />}
          />
          <ResultCard
            label="OD (Actual)"
            value={pipeSize?.odMm.toFixed(1) || "—"}
            unit="mm"
            icon={<Wrench className="w-4 h-4" />}
          />
        </div>

        {/* Thread Pitch Visual Match - Pro Feature */}
        {pipeSize && (
          <ThreadPitchMatch
            pipeSize={pipeSize}
            selectedType={threadType}
            isPro={isPro}
            onUpgrade={() => navigate("/upgrade")}
          />
        )}

        {/* Thread Type */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Thread Type</h3>
          <ThreadTypeSelector value={threadType} onChange={setThreadType} />
        </div>

        {/* Material */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Material</h3>
          <MaterialSelector value={material} onChange={setMaterial} />
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/80 backdrop-blur-xl border-t border-border safe-area-bottom">
        <Button
          variant="industrial"
          size="lg"
          className="w-full"
          onClick={() => navigate("/measure")}
        >
          <RotateCcw className="w-5 h-5" />
          New Measurement
        </Button>
      </div>
    </div>
  );
}
