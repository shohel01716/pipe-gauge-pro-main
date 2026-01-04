import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { incrementUsage } from "@/lib/usageStore";
import { inchesToMm } from "@/lib/pipeData";

type Unit = "mm" | "inches";

export default function ManualEntry() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<Unit>("mm");

  const handleSubmit = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;
    
    const diameterMm = unit === "inches" ? inchesToMm(numValue) : numValue;
    incrementUsage();
    navigate("/results", { 
      state: { 
        diameterMm,
        source: "manual" 
      } 
    });
  };

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setValue(prev => prev.slice(0, -1));
    } else if (key === "." && !value.includes(".")) {
      setValue(prev => prev + key);
    } else if (key !== "." && value.length < 6) {
      setValue(prev => prev + key);
    }
  };

  const numValue = parseFloat(value) || 0;
  const isValid = numValue > 0 && numValue < 500;

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Manual Entry</h1>
        <div className="w-11" />
      </header>

      {/* Unit Toggle */}
      <div className="px-5 py-4">
        <div className="bg-muted rounded-xl p-1 flex">
          <button
            onClick={() => setUnit("mm")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              unit === "mm" 
                ? "bg-card text-foreground shadow-card" 
                : "text-muted-foreground"
            }`}
          >
            Millimeters
          </button>
          <button
            onClick={() => setUnit("inches")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              unit === "inches" 
                ? "bg-card text-foreground shadow-card" 
                : "text-muted-foreground"
            }`}
          >
            Inches
          </button>
        </div>
      </div>

      {/* Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <motion.div
          key={value}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="measurement-display text-6xl text-foreground mb-2">
            {value || "0"}
          </div>
          <div className="text-xl text-muted-foreground">
            {unit === "mm" ? "mm" : "inches"}
          </div>
        </motion.div>

        {value && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-muted-foreground text-sm"
          >
            = {unit === "mm" 
              ? `${(numValue / 25.4).toFixed(3)}"` 
              : `${(numValue * 25.4).toFixed(1)} mm`
            }
          </motion.div>
        )}
      </div>

      {/* Keypad */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-16 rounded-xl bg-card border-2 border-border text-xl font-semibold text-foreground active:bg-muted transition-colors shadow-card"
            >
              {key === "backspace" ? "⌫" : key}
            </button>
          ))}
        </div>

        <Button
          variant="industrial"
          size="xl"
          className="w-full"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Get Pipe Size
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
