import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Check, 
  Infinity, 
  Bookmark, 
  Wifi, 
  FileText,
  Wrench,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { setProStatus } from "@/lib/usageStore";
import { toast } from "sonner";

const PRO_FEATURES = [
  { icon: Infinity, text: "Unlimited pipe measurements" },
  { icon: Wrench, text: "Thread pitch visual matching (NPT, BSP, Metric)" },
  { icon: Bookmark, text: "Save and favorite common sizes" },
  { icon: Wifi, text: "Works offline on job sites" },
  { icon: FileText, text: "Export measurements" },
];

export default function Upgrade() {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // In production, this triggers Apple In-App Purchase
    // For demo purposes, we enable Pro status and navigate to success screen
    setProStatus(true);
    navigate("/pro-unlocked");
  };

  const handleRestore = () => {
    toast.info("Checking for previous purchases...", {
      description: "Contacting App Store...",
    });
    // In production, this would restore purchases from App Store
    setTimeout(() => {
      toast.error("No previous purchase found");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom flex flex-col">
      {/* Header Nav */}
      <header className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 px-6 pb-8 flex flex-col">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground leading-tight mb-3">
            Work Faster. Get the Right Fitting. Every Time.
          </h1>
          <p className="text-muted-foreground">
            Unlock professional tools built for real job sites.
          </p>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-8"
        >
          {PRO_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border shadow-card"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-accent" />
              </div>
              <span className="text-foreground font-medium text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8 py-4 border-y border-border"
        >
          <p className="text-foreground font-semibold mb-1">
            Built for plumbers, HVAC techs, and contractors.
          </p>
          <p className="text-muted-foreground text-sm">
            No charts. No guesswork. Just accurate results.
          </p>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary rounded-2xl p-6 text-center shadow-tool mb-6"
        >
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-4xl font-bold text-primary-foreground">$29.99</span>
            <span className="text-primary-foreground/70 text-lg">/ year</span>
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Less than the cost of one wrong fitting.
          </p>
        </motion.div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Button
            variant="accent"
            size="xl"
            className="w-full text-base font-bold"
            onClick={handleUpgrade}
          >
            Upgrade to Pro
          </Button>

          <button
            onClick={handleRestore}
            className="w-full text-center text-sm text-muted-foreground py-3 font-medium"
          >
            Restore Purchase
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Cancel anytime · Secure payment through Apple</span>
        </motion.div>
      </main>
    </div>
  );
}
