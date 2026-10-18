import { Play, Pause, SkipForward, RotateCcw, Gauge } from 'lucide-react';

export const ConcurrencyControls = ({
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  speed,
  onSpeedChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayPause}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-white transition-colors ${
            isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pausar' : 'Iniciar Auto'}
        </button>

        <button
          onClick={onStep}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200 font-semibold text-sm rounded-lg transition-colors"
        >
          <SkipForward className="w-4 h-4" /> Paso a Paso
        </button>

        <button
          onClick={onReset}
          className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          title="Reiniciar Simulación"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Gauge className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Velocidad:</span>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-28 cursor-pointer accent-purple-600"
        />
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-12">{speed}ms</span>
      </div>
    </div>
  );
};