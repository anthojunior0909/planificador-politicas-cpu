import { Play, Pause, SkipForward, RotateCcw, FastForward, ChevronsRight } from 'lucide-react';

export const SimulationControls = ({
  isPlaying,
  onPlayPause,
  onStep,
  onSkipToEnd,
  onReset,
  speed,
  onSpeedChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-3">
        
        {/* Botón Play / Pause (Mantiene sus colores porque ya contrastan bien con texto blanco) */}
        <button
          onClick={onPlayPause}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all shadow-sm ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700'
              : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {isPlaying ? 'Pausar' : 'Iniciar'}
        </button>

        {/* Botón Paso a Paso */}
        <button
          onClick={onStep}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
        >
          <SkipForward className="w-4 h-4" /> Paso a Paso
        </button>

        {/* Botón Ir al Final (Este ya lo teníamos adaptado) */}
        <button
          onClick={onSkipToEnd}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-semibold border border-purple-200 dark:border-purple-800/50 transition-colors"
        >
          <ChevronsRight className="w-4 h-4" /> Ir al Final
        </button>

        {/* Botón Reiniciar */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold border border-red-200 dark:border-red-800/50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </button>
      </div>

      {/* Contenedor del Selector de Velocidad */}
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <FastForward className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Velocidad:</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          /* Nota: Se añade dark:bg-gray-800 para que al desplegar las opciones no se vean blancas en Windows */
          className="bg-transparent border-none text-sm font-bold text-gray-800 dark:text-gray-200 dark:bg-gray-800 focus:outline-none cursor-pointer"
        >
          <option value={1000}>1.0x (1s)</option>
          <option value={500}>2.0x (0.5s)</option>
          <option value={200}>5.0x (0.2s)</option>
          <option value={50}>10.0x (Rápido)</option>
        </select>
      </div>
    </div>
  );
};