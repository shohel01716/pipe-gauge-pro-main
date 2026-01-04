import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Check,
  Infinity,
  Wrench,
  Wifi,
  Bookmark,
  FileText,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const UNLOCKED_FEATURES = [
  { icon: Infinity, text: "Unlimited measurements" },
  { icon: Wrench, text: "Thread pitch visual matching" },
  { icon: Wifi, text: "Offline mode" },
  { icon: Bookmark, text: "Saved measurements & favorites" },
  { icon: FileText, text: "Export tools" },
];

export default function ProUnlocked() {
  const navigate = useNavigate();

  const handleStartMeasuring = () => {
    navigate("/measure");
  };

  const handleViewFeatures = () => {
    navigate("/saved");
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom flex flex-col">
      <main className="flex-1 px-6 py-8 flex flex-col">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Animated Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mx-auto mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-tool mx-auto">
              <Crown className="w-12 h-12 text-accent-foreground" />
            </div>
            {/* Success ring animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute inset-0 w-24 h-24 rounded-full border-4 border-accent mx-auto"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-foreground mb-2"
          >
            Pro Unlocked
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            You're ready to work faster on every job.
          </motion.p>
        </motion.div>

        {/* Confirmation Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-accent/10 rounded-2xl p-5 text-center mb-8 border border-accent/20"
        >
          <p className="text-foreground font-semibold mb-1">
            Your PipeGauge Pro subscription is now active.
          </p>
          <p className="text-muted-foreground text-sm">
            All professional features are unlocked.
          </p>
        </motion.div>

        {/* Unlocked Features Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 text-center">
            WHAT'S INCLUDED
          </h2>
          <div className="space-y-2">
            {UNLOCKED_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
          <Button
            variant="accent"
            size="xl"
            className="w-full text-base font-bold"
            onClick={handleStartMeasuring}
          >
            Start Measuring
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="w-full text-muted-foreground"
            onClick={handleViewFeatures}
          >
            View Pro Features
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

        {/* Footer Reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-6 px-4"
        >
          Subscription managed securely through Apple.
          <br />
          Cancel anytime in App Store settings.
        </motion.p>
      </main>
    </div>
  );
}
