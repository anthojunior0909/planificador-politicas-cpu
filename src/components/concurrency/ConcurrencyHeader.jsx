import { Network, ShieldCheck, ShieldAlert } from 'lucide-react';
import { SCENARIOS } from '../../hooks/useConcurrency.js';

export const ConcurrencyHeader = ({ 
  selectedScenario, 
  onScenarioChange, 
  syncEnabled, 
  onToggleSync 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-600 rounded-xl text-white shadow-md">
          <Network className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Simulador de Concurrencia y Sincronización
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Exclusión mutua, semáforos y prevención de condiciones de carrera.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <select
          value={selectedScenario}
          onChange={(e) => onScenarioChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
        >
          <option value={SCENARIOS.PRODUCER_CONSUMER}>1. Productor - Consumidor</option>
          <option value={SCENARIOS.READERS_WRITERS}>2. Lectores - Escritores</option>
          <option value={SCENARIOS.DINING_PHILOSOPHERS}>3. Filósofos Comensales</option>
          <option value={SCENARIOS.SLEEPING_BARBER}>4. El Barbero Dormilón</option>
          <option value={SCENARIOS.CIGARETTE_SMOKERS}>5. Los Fumadores</option>
        </select>

        <button
          onClick={onToggleSync}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition-all border ${
            syncEnabled
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
          }`}
        >
          {syncEnabled ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          {syncEnabled ? 'Sincronización ON' : 'Sincronización OFF'}
        </button>
      </div>
    </div>
  );
};