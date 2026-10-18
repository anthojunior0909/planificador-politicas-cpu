import { useState } from 'react';
import { Utensils, ShieldCheck, ShieldAlert, AlertTriangle, Play, Clock } from 'lucide-react';

export const PhilosophersView = ({
  simulationState,
  onEat,
  onForceDeadlock,
  onDurationChange,
  syncEnabled,
  onToggleSync
}) => {
  const [eatDuration, setEatDuration] = useState(3);

  if (!simulationState) return null;

  const { chopsticks = [], philosophers = [], logs = [] } = simulationState;

  const handleDurationChange = (sec) => {
    const val = Number(sec);
    setEatDuration(val);
    if (onDurationChange) {
      onDurationChange(val);
    }
  };

  const getPhilosopherStyle = (index) => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    const radius = 38;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { left: `${x}%`, top: `${y}%` };
  };

  const getChopstickStyle = (index) => {
    const angle = (index * 72 - 54) * (Math.PI / 180);
    const radius = 25;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(${index * 72}deg)` };
  };

  return (
    <div className="space-y-6">
      
      {/* BARRA SUPERIOR DE CONTROLES Y TIEMPO DE COMIDA */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleSync}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              syncEnabled
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
            }`}
          >
            {syncEnabled ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            {syncEnabled ? 'Sincronización ACTIVADA' : 'Sin Sincronización (Carrera de Datos)'}
          </button>

          {/* CONTROL DEL TIEMPO DE COMIDA */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Tiempo de Comida:</span>
            <input
              type="number"
              min="1"
              max="15"
              value={eatDuration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="w-12 px-1.5 py-0.5 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 font-bold"
            />
            <span className="text-gray-500">s</span>
          </div>
        </div>

        <button
          onClick={onForceDeadlock}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
        >
          <AlertTriangle className="w-4 h-4" /> Provocar Interbloqueo (Deadlock)
        </button>
      </div>

      {/* MESA CIRCULAR Y PANEL DE ESTADO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MESA CIRCULAR VISUAL */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
          <div className="w-72 h-72 rounded-full border-8 border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10 relative flex items-center justify-center">
            
            <span className="text-xs font-bold text-amber-800/40 dark:text-amber-200/40 uppercase tracking-widest pointer-events-none">
              Mesa Circular
            </span>

            {/* CUBIERTOS / PALILLOS */}
            {chopsticks.map((isUsed, idx) => (
              <div
                key={`chopstick-${idx}`}
                style={getChopstickStyle(idx)}
                className={`absolute w-3 h-8 rounded-full transition-all duration-300 shadow-sm ${
                  isUsed ? 'bg-red-500 scale-110' : 'bg-amber-500'
                }`}
                title={`Cubierto ${idx}: ${isUsed ? 'En uso' : 'Libre'}`}
              />
            ))}

            {/* FILÓSOFOS */}
            {philosophers.map((p) => (
              <div
                key={`philosopher-${p.id}`}
                style={getPhilosopherStyle(p.id)}
                className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex flex-col items-center justify-center font-bold text-xs text-white shadow-md transition-all duration-300 ${
                  p.state === 'EATING'
                    ? 'bg-emerald-500 ring-4 ring-emerald-300 dark:ring-emerald-800 scale-110'
                    : p.state === 'BLOCKED'
                    ? 'bg-red-600 ring-4 ring-red-300 dark:ring-red-900 animate-pulse'
                    : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <Utensils className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">F{p.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DE ESTADO DE LOS FILÓSOFOS */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-purple-600" /> Estado de Filósofos
            </h4>

            <div className="space-y-3">
              {philosophers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <span className="font-bold text-xs text-gray-700 dark:text-gray-300">{p.name}</span>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                      p.state === 'EATING'
                        ? 'bg-emerald-500 text-white'
                        : p.state === 'BLOCKED'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {p.state}
                    </span>

                    <button
                      onClick={() => onEat(p.id)}
                      className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                      title="Acción Filósofo"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* LOGS */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm font-mono text-xs">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Logs de la Mesa</h4>
        <div className="bg-gray-900 text-gray-200 p-3 rounded-lg h-32 overflow-y-auto space-y-1 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-gray-500">[{log.time}]</span>
              <span>{log.msg}</span>
            </div>
          ))}
          {logs.length === 0 && <span className="text-gray-500 italic">Haz clic en el botón Play de un filósofo para iniciar...</span>}
        </div>
      </div>

    </div>
  );
};