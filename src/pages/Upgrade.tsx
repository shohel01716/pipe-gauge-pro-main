import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Check, 
  Infinity as InfinityIcon, 
  Bookmark, 
  Wifi, 
  FileText,
  Wrench,
  Shield,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { setProStatus } from "@/lib/usageStore";
import { toast } from "sonner";
import { iapService, LIFETIME_PRO_PRODUCT_ID } from "@/lib/iapService";
import { useState, useEffect } from "react";

const PRO_FEATURES = [
  { icon: InfinityIcon, text: "Unlimited pipe measurements" },
  { icon: Wrench, text: "Thread pitch visual matching (NPT, BSP, Metric)" },
  { icon: Bookmark, text: "Save and favorite common sizes" },
  { icon: Wifi, text: "Works offline on job sites" },
  { icon: FileText, text: "Export measurements" },
];

export default function Upgrade() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [productPrice, setProductPrice] = useState("$29.99");

  useEffect(() => {
    // Initialize IAP and fetch product info
    const init = async () => {
      await iapService.initialize();
      const product = await iapService.getProduct(LIFETIME_PRO_PRODUCT_ID);
      if (product) {
        setProductPrice(product.price);
      }
    };
    init();
  }, []);

  const handleUpgrade = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    toast.info("Processing purchase...", {
      description: "Contacting App Store...",
    });

    try {
      const result = await iapService.purchase(LIFETIME_PRO_PRODUCT_ID);
      
      if (result.success) {
        // Purchase successful, enable Pro status
        setProStatus(true);
        toast.success("Purchase successful!", {
          description: "Pro features unlocked",
        });
        navigate("/pro-unlocked");
      } else {
        // Purchase failed or cancelled
        toast.error("Purchase failed", {
          description: result.error || "Unable to complete purchase",
        });
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase error", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (isRestoring) return;
    
    setIsRestoring(true);
    toast.info("Checking for previous purchases...", {
      description: "Contacting App Store...",
    });

    try {
      const result = await iapService.restorePurchases();
      
      if (result.success) {
        // Restore successful
        setProStatus(true);
        toast.success("Purchase restored!", {
          description: "Pro features unlocked",
        });
        navigate("/pro-unlocked");
      } else {
        // No previous purchase found
        toast.error("No previous purchase found", {
          description: result.error || "Please make a new purchase",
        });
      }
    } catch (error) {
      console.error("Restore error:", error);
      toast.error("Restore failed", {
        description: "Please try again",
      });
    } finally {
      setIsRestoring(false);
    }
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
          <div className="flex flex-col items-center mb-2">
            <div className="text-sm text-primary-foreground/70 mb-1">One-time payment</div>
            <span className="text-4xl font-bold text-primary-foreground">{productPrice}</span>
            <span className="text-primary-foreground/70 text-sm mt-1">Lifetime Access</span>
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Pay once. Use forever. No subscriptions.
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
            disabled={isLoading || isRestoring}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Get Lifetime Access"
            )}
          </Button>

          <button
            onClick={handleRestore}
            disabled={isLoading || isRestoring}
            className="w-full text-center text-sm text-muted-foreground py-3 font-medium disabled:opacity-50"
          >
            {isRestoring ? "Restoring..." : "Restore Purchase"}
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
