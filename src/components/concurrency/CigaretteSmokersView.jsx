import { Flame, Sparkles, ShieldCheck, ShieldAlert, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export const CigaretteSmokersView = ({ 
  simulationState, 
  onAgentAction, 
  onSmokerAction, 
  syncEnabled, 
  onToggleSync 
}) => {
  if (!simulationState) return null;

  const { tableIngredients, agentState, smokers, logs } = simulationState;

  return (
    <div className="space-y-6">
      
      {/* PANEL DE CONTROL DE SINCRONIZACIÓN */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
        <button
          onClick={onToggleSync}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            syncEnabled
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
              : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
          }`}
        >
          {syncEnabled ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          {syncEnabled ? 'Sincronización ACTIVADA' : 'Sin Semáforos (Fumadores disputan la mesa)'}
        </button>

        <button
          onClick={onAgentAction}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Poner Ingredientes (Agente)
        </button>
      </div>

      {/* ÁREA INTERACTIVA: MESA DEL AGENTE Y LOS 3 FUMADORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MESA DEL AGENTE (RECURSO COMPARTIDO) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[260px] text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mesa del Agente</span>
          
          <div className="w-40 h-28 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 flex flex-col items-center justify-center p-3 my-2 shadow-inner">
            {tableIngredients.length > 0 ? (
              <div className="flex gap-2">
                {tableIngredients.map((item, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">Mesa Vacía</span>
            )}
          </div>

          <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-semibold mt-2">
            Estado Agente: {agentState}
          </span>
        </div>

        {/* TARJETAS DE LOS FUMADORES */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" /> Hilos Fumadores
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {smokers.map((s, idx) => (
              <div 
                key={s.id} 
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  s.state === 'SMOKING' 
                    ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 shadow-md scale-105' 
                    : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xs text-gray-800 dark:text-gray-200">{s.id.replace('_', ' ')}</span>
                    {s.state === 'SMOKING' && <Flame className="w-4 h-4 text-amber-500 animate-bounce" />}
                  </div>

                  <div className="text-[11px] space-y-1 mb-3 text-gray-600 dark:text-gray-400">
                    <div>Tiene: <strong className="text-purple-600 dark:text-purple-400">{s.has}</strong></div>
                    <div>Necesita: <strong className="text-gray-700 dark:text-gray-300">{s.needs.join(' + ')}</strong></div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    s.state === 'SMOKING' ? 'bg-amber-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {s.state}
                  </span>
                  
                  <button
                    onClick={() => onSmokerAction(idx)}
                    className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                    title="Intentar Fumar"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* LOGS */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm font-mono text-xs">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Logs de la Mesa de Fumadores</h4>
        <div className="bg-gray-900 text-gray-200 p-3 rounded-lg h-32 overflow-y-auto space-y-1 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-gray-500">[{log.time}]</span>
              <span>{log.msg}</span>
            </div>
          ))}
          {logs.length === 0 && <span className="text-gray-500 italic">Haz clic en "Poner Ingredientes" para iniciar...</span>}
        </div>
      </div>

    </div>
  );
};