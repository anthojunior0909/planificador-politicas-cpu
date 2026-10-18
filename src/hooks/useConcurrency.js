import { useState, useEffect, useRef, useCallback } from 'react';

export const SCENARIOS = {
  PRODUCER_CONSUMER: 'PRODUCER_CONSUMER',
  READERS_WRITERS: 'READERS_WRITERS',
  DINING_PHILOSOPHERS: 'DINING_PHILOSOPHERS',
  SLEEPING_BARBER: 'SLEEPING_BARBER',
  CIGARETTE_SMOKERS: 'CIGARETTE_SMOKERS'
};

export const useConcurrency = () => {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS.PRODUCER_CONSUMER);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms por tick
  const [tick, setTick] = useState(0);
  const [syncEnabled, setSyncEnabled] = useState(true); // Toggle para ver con/sin sincronización
  
  const timerRef = useRef(null);

  const handleStep = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleStep();
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, handleStep]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleReset = () => {
    setIsPlaying(false);
    setTick(0);
  };

  const changeScenario = (newScenario) => {
    setIsPlaying(false);
    setSelectedScenario(newScenario);
    setTick(0);
  };

  return {
    selectedScenario,
    changeScenario,
    isPlaying,
    handlePlayPause,
    handleStep,
    handleReset,
    speed,
    setSpeed,
    tick,
    syncEnabled,
    setSyncEnabled
  };
};