import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MeasurementOverlayProps {
  onMeasure: (diameterMm: number) => void;
  isActive: boolean;
}

export function MeasurementOverlay({ onMeasure, isActive }: MeasurementOverlayProps) {
  const [diameter, setDiameter] = useState(50);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startDiameter = useRef(50);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAdjusting(true);
    startY.current = e.touches[0].clientY;
    startDiameter.current = diameter;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isAdjusting) return;
    const deltaY = startY.current - e.touches[0].clientY;
    const newDiameter = Math.min(150, Math.max(10, startDiameter.current + deltaY * 0.5));
    setDiameter(newDiameter);
  };

  const handleTouchEnd = () => {
    setIsAdjusting(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -2 : 2;
    setDiameter(prev => Math.min(150, Math.max(10, prev + delta)));
  };

  const handleCapture = () => {
    onMeasure(diameter);
  };

  const ringSize = Math.min(280, diameter * 2.5);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-foreground/95"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Simulated camera view with grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--accent) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--accent) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-px h-16 bg-accent/50" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-px w-16 bg-accent/50" />
      </div>

      {/* Measurement ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="measurement-ring"
            style={{ width: ringSize, height: ringSize }}
          >
            <div 
              className="w-full h-full rounded-full border-4 border-accent flex items-center justify-center"
              style={{
                boxShadow: '0 0 40px hsl(var(--accent) / 0.4), inset 0 0 40px hsl(var(--accent) / 0.1)'
              }}
            >
              <div className="text-center">
                <div className="measurement-display text-5xl text-accent">
                  {diameter.toFixed(1)}
                </div>
                <div className="text-accent/70 text-sm font-medium mt-1">mm</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-32 left-0 right-0 text-center">
        <p className="text-primary-foreground/60 text-sm">
          Drag up/down to adjust size
        </p>
      </div>

      {/* Capture button */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCapture}
          className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-tool"
          style={{
            boxShadow: '0 0 30px hsl(var(--accent) / 0.5)'
          }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-accent-foreground/30" />
        </motion.button>
      </div>

      {/* Adjustment indicator */}
      <AnimatePresence>
        {isAdjusting && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2"
          >
            <div className="measurement-display text-2xl text-foreground">
              {diameter.toFixed(1)} mm
            </div>
            <div className="text-muted-foreground text-xs">
              {(diameter / 25.4).toFixed(3)}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
