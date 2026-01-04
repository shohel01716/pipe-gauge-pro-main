import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MeasurementOverlay } from "@/components/MeasurementOverlay";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { incrementUsage } from "@/lib/usageStore";

export default function Measure() {
  const navigate = useNavigate();
  const [isActive] = useState(true);

  const handleMeasure = (diameterMm: number) => {
    incrementUsage();
    navigate("/results", { 
      state: { 
        diameterMm,
        source: "camera" 
      } 
    });
  };

  return (
    <div className="h-screen flex flex-col bg-foreground">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 safe-area-top">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-primary-foreground font-semibold">Measure Pipe</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/")}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Camera/Measurement View */}
      <div className="flex-1">
        <MeasurementOverlay 
          onMeasure={handleMeasure} 
          isActive={isActive} 
        />
      </div>
    </div>
  );
}
