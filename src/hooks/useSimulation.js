import { useState, useEffect, useCallback } from 'react';

export function useSimulation(maxSteps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); 
  
  const [prevMaxSteps, setPrevMaxSteps] = useState(maxSteps);

  if (maxSteps !== prevMaxSteps) {
    setPrevMaxSteps(maxSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    let timer = null;
    if (isPlaying && maxSteps > 0) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, maxSteps, speed]);

  const togglePlayPause = useCallback(() => {
    if (maxSteps > 0 && currentStep < maxSteps - 1) setIsPlaying((prev) => !prev);
  }, [maxSteps, currentStep]);

  const stepForward = useCallback(() => {
    if (currentStep < maxSteps - 1) setCurrentStep((prev) => prev + 1);
  }, [currentStep, maxSteps]);

  // NUEVO: Saltar directamente al final
  const skipToEnd = useCallback(() => {
    setIsPlaying(false);
    if (maxSteps > 0) setCurrentStep(maxSteps - 1);
  }, [maxSteps]);

  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  return {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    togglePlayPause,
    stepForward,
    skipToEnd,
    resetSimulation,
  };
}