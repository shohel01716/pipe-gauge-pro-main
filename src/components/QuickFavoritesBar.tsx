import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Lock, ChevronRight } from "lucide-react";
import { getQuickFavorites, QuickFavorite } from "@/lib/quickFavorites";
import { isProUser } from "@/lib/usageStore";
import { cn } from "@/lib/utils";

interface QuickFavoritesBarProps {
  onSelect: (favorite: QuickFavorite) => void;
}

export function QuickFavoritesBar({ onSelect }: QuickFavoritesBarProps) {
  const navigate = useNavigate();
  const isPro = isProUser();
  const favorites = getQuickFavorites();

  if (!isPro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate("/upgrade")}
          className="w-full bg-card/50 rounded-xl border-2 border-dashed border-border p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              Quick Favorites
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">PRO</span>
            </div>
            <div className="text-xs text-muted-foreground">
              1-tap access to your common sizes
            </div>
          </div>
          <Lock className="w-4 h-4 text-muted-foreground" />
        </button>
      </motion.div>
    );
  }

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-muted-foreground">Quick Favorites</span>
        </div>
        <div className="bg-card/50 rounded-xl border-2 border-dashed border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Star a pipe size from Results to add quick access here
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-warning fill-warning" />
        <span className="text-sm font-medium text-foreground">Quick Favorites</span>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {favorites.map((favorite, index) => (
          <motion.button
            key={favorite.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(favorite)}
            className={cn(
              "flex-shrink-0 bg-card rounded-xl border-2 border-border p-3 min-w-[90px]",
              "hover:border-accent hover:shadow-tool transition-all active:scale-[0.98]"
            )}
          >
            <div className="measurement-display text-xl text-foreground">
              {favorite.nps}"
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {favorite.odMm.toFixed(1)} mm
            </div>
          </motion.button>
        ))}
        
        <button
          onClick={() => navigate("/saved")}
          className="flex-shrink-0 bg-muted/50 rounded-xl border-2 border-dashed border-border p-3 min-w-[60px] flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}
