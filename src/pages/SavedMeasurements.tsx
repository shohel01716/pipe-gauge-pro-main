import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Star, 
  Trash2, 
  Package,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getSavedMeasurements, 
  deleteMeasurement, 
  toggleFavorite,
  SavedMeasurement 
} from "@/lib/measurementStore";
import { isProUser } from "@/lib/usageStore";
import { cn } from "@/lib/utils";

export default function SavedMeasurements() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<SavedMeasurement[]>([]);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const isPro = isProUser();

  useEffect(() => {
    setMeasurements(getSavedMeasurements());
  }, []);

  const handleDelete = (id: string) => {
    deleteMeasurement(id);
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    setMeasurements(getSavedMeasurements());
  };

  const filteredMeasurements = filter === "favorites" 
    ? measurements.filter(m => m.isFavorite)
    : measurements;

  if (!isPro) {
    return (
      <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
        <header className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Saved Measurements</h1>
          <div className="w-11" />
        </header>

        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Crown className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Pro Feature</h2>
          <p className="text-muted-foreground mb-8">
            Save and organize your measurements with labels, notes, and favorites.
          </p>
          <Button 
            variant="accent" 
            size="lg"
            onClick={() => navigate("/upgrade")}
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Saved Measurements</h1>
        <div className="w-11" />
      </header>

      {/* Filter */}
      <div className="px-5 py-3">
        <div className="bg-muted rounded-xl p-1 flex">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-medium text-sm transition-all",
              filter === "all" 
                ? "bg-card text-foreground shadow-card" 
                : "text-muted-foreground"
            )}
          >
            All ({measurements.length})
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5",
              filter === "favorites" 
                ? "bg-card text-foreground shadow-card" 
                : "text-muted-foreground"
            )}
          >
            <Star className="w-4 h-4" />
            Favorites
          </button>
        </div>
      </div>

      {/* List */}
      <main className="px-5 pb-8">
        {filteredMeasurements.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filter === "favorites" ? "No favorites yet" : "No saved measurements"}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {filteredMeasurements.map((measurement) => (
                <motion.div
                  key={measurement.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card rounded-xl border-2 border-border p-4 shadow-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="measurement-display text-2xl text-foreground">
                        NPS {measurement.nps}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {measurement.diameterMm.toFixed(1)} mm • {measurement.threadType}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleToggleFavorite(measurement.id)}
                      >
                        <Star 
                          className={cn(
                            "w-5 h-5",
                            measurement.isFavorite 
                              ? "fill-warning text-warning" 
                              : "text-muted-foreground"
                          )} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive"
                        onClick={() => handleDelete(measurement.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground">
                      {measurement.material}
                    </span>
                    <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground">
                      {measurement.threadInfo}
                    </span>
                  </div>

                  {measurement.label && (
                    <div className="mt-3 text-sm text-foreground font-medium">
                      {measurement.label}
                    </div>
                  )}

                  {measurement.notes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {measurement.notes}
                    </div>
                  )}

                  <div className="mt-3 text-xs text-muted-foreground">
                    {new Date(measurement.timestamp).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
