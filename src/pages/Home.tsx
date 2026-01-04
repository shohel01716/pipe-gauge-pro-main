import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UsageBadge } from "@/components/UsageBadge";
import { QuickFavoritesBar } from "@/components/QuickFavoritesBar";
import { Camera, Ruler, BookmarkCheck, Crown, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { isProUser, canMeasure } from "@/lib/usageStore";
import { QuickFavorite } from "@/lib/quickFavorites";
import { findClosestPipeSize, mmToInches } from "@/lib/pipeData";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const isPro = isProUser();

  const handleMeasure = () => {
    if (!canMeasure()) {
      toast.error("Daily limit reached", {
        description: "Upgrade to Pro for unlimited measurements",
        action: {
          label: "Upgrade",
          onClick: () => navigate("/upgrade"),
        },
      });
      return;
    }
    navigate("/measure");
  };

  const handleManualEntry = () => {
    if (!canMeasure()) {
      toast.error("Daily limit reached", {
        description: "Upgrade to Pro for unlimited measurements",
        action: {
          label: "Upgrade",
          onClick: () => navigate("/upgrade"),
        },
      });
      return;
    }
    navigate("/manual");
  };

  const handleQuickFavorite = (favorite: QuickFavorite) => {
    // Navigate directly to results with the favorite's data
    navigate("/results", {
      state: {
        diameterMm: favorite.odMm,
        source: "favorite",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-tool">
              <Gauge className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PipeGauge</h1>
              <p className="text-sm text-muted-foreground">Pro</p>
            </div>
          </div>
          <UsageBadge />
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-sm"
        >
          Identify pipe sizes, threads, and specifications instantly.
        </motion.p>
      </header>

      {/* Quick Favorites */}
      <div className="px-5">
        <QuickFavoritesBar onSelect={handleQuickFavorite} />
      </div>

      {/* Main Actions */}
      <main className="px-5 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button 
            variant="industrial" 
            size="xl" 
            className="w-full justify-start gap-4"
            onClick={handleMeasure}
          >
            <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-lg">Measure Pipe</div>
              <div className="text-sm opacity-70 font-normal">Camera measurement</div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Button 
            variant="tool" 
            size="xl" 
            className="w-full justify-start gap-4"
            onClick={handleManualEntry}
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Ruler className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-left">
              <div className="text-lg">Manual Entry</div>
              <div className="text-sm text-muted-foreground font-normal">Enter diameter directly</div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="tool" 
            size="xl" 
            className="w-full justify-start gap-4"
            onClick={() => navigate("/saved")}
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <BookmarkCheck className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-left flex-1">
              <div className="text-lg">Saved Measurements</div>
              <div className="text-sm text-muted-foreground font-normal">View history & favorites</div>
            </div>
            {!isPro && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                PRO
              </span>
            )}
          </Button>
        </motion.div>

        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Button 
              variant="accent" 
              size="xl" 
              className="w-full justify-start gap-4 mt-4"
              onClick={() => navigate("/upgrade")}
            >
              <div className="w-12 h-12 rounded-lg bg-accent-foreground/10 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-lg">Upgrade to Pro</div>
                <div className="text-sm opacity-70 font-normal">Unlimited measurements • $29.99/yr</div>
              </div>
            </Button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-5 safe-area-bottom">
        <p className="text-center text-xs text-muted-foreground">
          PipeGauge Pro v1.0 • Professional Pipe Measurement
        </p>
      </footer>
    </div>
  );
}
