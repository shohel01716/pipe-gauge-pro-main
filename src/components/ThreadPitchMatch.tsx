import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PipeSize, ThreadType } from "@/lib/pipeData";

interface ThreadPitchMatchProps {
  pipeSize: PipeSize;
  selectedType: ThreadType;
  isPro: boolean;
  onUpgrade: () => void;
}

interface ThreadPitchData {
  type: ThreadType;
  tpi: number;
  pitch: number; // mm per thread
  angle: number; // thread angle in degrees
  description: string;
}

function getThreadPitchData(pipeSize: PipeSize): ThreadPitchData[] {
  return [
    {
      type: "NPT",
      tpi: pipeSize.nptThreadsPerInch,
      pitch: 25.4 / pipeSize.nptThreadsPerInch,
      angle: 60,
      description: "US National Pipe Taper",
    },
    {
      type: "BSP",
      tpi: pipeSize.bspThreadsPerInch,
      pitch: 25.4 / pipeSize.bspThreadsPerInch,
      angle: 55,
      description: "British Standard Pipe",
    },
    {
      type: "Metric",
      tpi: Math.round(25.4 / 1.5), // Common metric pitch
      pitch: 1.5,
      angle: 60,
      description: "ISO Metric Thread",
    },
  ];
}

function ThreadVisual({ pitch, angle, isMatch }: { pitch: number; angle: number; isMatch: boolean }) {
  // Create a visual representation of thread pitch
  const threadCount = 8;
  const spacing = Math.max(8, Math.min(20, pitch * 4));
  
  return (
    <div className="relative w-full h-32 bg-secondary/30 rounded-xl overflow-hidden">
      {/* Thread profile visualization */}
      <svg 
        viewBox="0 0 200 80" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Base pipe surface */}
        <rect x="0" y="55" width="200" height="25" fill="hsl(var(--muted))" />
        
        {/* Thread teeth */}
        {Array.from({ length: threadCount }).map((_, i) => {
          const x = 10 + i * spacing;
          const height = 25;
          const halfAngle = (angle / 2) * (Math.PI / 180);
          const topWidth = height / Math.tan(halfAngle) * 0.3;
          
          return (
            <polygon
              key={i}
              points={`
                ${x},55 
                ${x + topWidth},30 
                ${x + topWidth * 2},55
              `}
              fill={isMatch ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"}
              opacity={isMatch ? 1 : 0.5}
            />
          );
        })}
        
        {/* Pitch measurement line */}
        <line 
          x1="10" 
          y1="20" 
          x2={10 + spacing} 
          y2="20" 
          stroke={isMatch ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} 
          strokeWidth="2"
        />
        <line x1="10" y1="15" x2="10" y2="25" stroke={isMatch ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} strokeWidth="2" />
        <line x1={10 + spacing} y1="15" x2={10 + spacing} y2="25" stroke={isMatch ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} strokeWidth="2" />
      </svg>
      
      {/* Match indicator */}
      {isMatch && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-accent-foreground" />
        </motion.div>
      )}
    </div>
  );
}

export function ThreadPitchMatch({ pipeSize, selectedType, isPro, onUpgrade }: ThreadPitchMatchProps) {
  const [currentIndex, setCurrentIndex] = useState(
    selectedType === "NPT" ? 0 : selectedType === "BSP" ? 1 : 2
  );
  
  const threadData = getThreadPitchData(pipeSize);
  const currentThread = threadData[currentIndex];
  const isMatch = currentThread.type === selectedType;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + threadData.length) % threadData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % threadData.length);
  };

  if (!isPro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border-2 border-border p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90 z-10" />
        
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          Thread Pitch Match
          <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
            PRO
          </span>
        </h3>
        
        <div className="opacity-30 pointer-events-none">
          <ThreadVisual pitch={1.8} angle={60} isMatch={false} />
        </div>
        
        <button
          onClick={onUpgrade}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm"
        >
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm font-semibold text-foreground">Unlock Thread Pitch Match</span>
          <span className="text-xs text-muted-foreground mt-1">Upgrade to Pro</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border-2 border-border p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        Thread Pitch Match
        {isMatch && (
          <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Check className="w-3 h-3" /> Best Match
          </span>
        )}
      </h3>

      {/* Swipeable Thread Cards */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <ThreadVisual 
              pitch={currentThread.pitch} 
              angle={currentThread.angle} 
              isMatch={isMatch}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center shadow-card"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center shadow-card"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Thread info */}
      <div className="mt-4 text-center">
        <div className={cn(
          "text-lg font-bold",
          isMatch ? "text-accent" : "text-foreground"
        )}>
          {currentThread.type}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentThread.description}
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-sm">
          <span className="measurement-display text-foreground">
            {currentThread.tpi} TPI
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="measurement-display text-foreground">
            {currentThread.pitch.toFixed(2)} mm
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {currentThread.angle}° angle
          </span>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {threadData.map((thread, index) => (
          <button
            key={thread.type}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex
                ? "bg-accent w-6"
                : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}
