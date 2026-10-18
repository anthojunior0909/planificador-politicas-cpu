import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Package, Clock, Lock } from 'lucide-react';

export const ProducerConsumerView = ({
  simulationState,
  onProduce,
  onConsume,
  onDurationChange,
  syncEnabled,
  onToggleSync
}) => {
  const [produceDuration, setProduceDuration] = useState(1);
  const [consumeDuration, setConsumeDuration] = useState(1);

  if (!simulationState) return null;

  const { buffer = [], emptyValue, fullValue, isMutexLocked, producers = [], consumers = [], logs = [] } = simulationState;

  const handleDurationChange = (pSec, cSec) => {
    setProduceDuration(pSec);
    setConsumeDuration(cSec);
    if (onDurationChange) {
      onDurationChange(pSec, cSec);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* BARRA SUPERIOR CON CONTROLES DE SINCRONIZACIÓN Y TIEMPOS */}
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
          {syncEnabled ? 'Sincronización ACTIVADA' : 'Sin Sincronización (Carrera de Datos)'}
        </button>

        {/* AJUSTE PERSONALIZADO DE TIEMPOS */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">T. Producción:</span>
            <input
              type="number"
              min="0.5"
              step="0.5"
              max="10"
              value={produceDuration}
              onChange={(e) => handleDurationChange(Number(e.target.value), consumeDuration)}
              className="w-12 px-1.5 py-0.5 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 font-bold"
            />
            <span className="text-gray-500">s</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">T. Consumo:</span>
            <input
              type="number"
              min="0.5"
              step="0.5"
              max="10"
              value={consumeDuration}
              onChange={(e) => handleDurationChange(produceDuration, Number(e.target.value))}
              className="w-12 px-1.5 py-0.5 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 font-bold"
            />
            <span className="text-gray-500">s</span>
          </div>
        </div>

        {/* ESTADO DE SEMÁFOROS Y MUTEX */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 font-semibold">
            Empty (Vacíos): <strong>{emptyValue}</strong>
          </span>
          <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 font-semibold">
            Full (Llenos): <strong>{fullValue}</strong>
          </span>
          <span className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 ${
            isMutexLocked
              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300'
              : 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 border-gray-200'
          }`}>
            <Lock className="w-3.5 h-3.5" />
            Mutex: <strong>{isMutexLocked ? 'OCUPADO' : 'LIBRE'}</strong>
          </span>
        </div>
      </div>

      {/* ÁREA INTERACTIVA: PRODUCTORES -> BUFFER -> CONSUMIDORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PRODUCTORES */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" /> Hilos Productores
            </h4>
            <div className="space-y-2 mb-4">
              {producers.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{p.id}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    p.state === 'RUNNING' ? 'bg-emerald-500 text-white animate-pulse' :
                    p.state.startsWith('BLOCKED') ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {p.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {producers.map(p => (
              <button
                key={p.id}
                onClick={() => onProduce(p.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                Producir ({p.id})
              </button>
            ))}
          </div>
        </div>

        {/* BUFFER COMPARTIDO */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">
            Buffer Compartido (Capacidad: {buffer.length})
          </h4>
          <div className="flex gap-2 justify-center flex-wrap">
            {buffer.map((slot, idx) => (
              <div
                key={idx}
                className={`w-12 h-14 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                  slot !== null
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold scale-105'
                    : 'bg-gray-50 dark:bg-gray-900/50 border-dashed border-gray-300 dark:border-gray-700 text-gray-400'
                }`}
              >
                <span className="text-[9px] text-gray-400 font-mono">[{idx}]</span>
                {slot !== null ? <Package className="w-5 h-5 text-emerald-600" /> : <span className="text-xs">-</span>}
              </div>
            ))}
          </div>
        </div>

        {/* CONSUMIDORES */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" /> Hilos Consumidores
            </h4>
            <div className="space-y-2 mb-4">
              {consumers.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{c.id}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    c.state === 'RUNNING' ? 'bg-purple-500 text-white animate-pulse' :
                    c.state.startsWith('BLOCKED') ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {c.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {consumers.map(c => (
              <button
                key={c.id}
                onClick={() => onConsume(c.id)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                Consumir ({c.id})
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* LOGS */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm font-mono text-xs">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Logs de Sincronización</h4>
        <div className="bg-gray-900 text-gray-200 p-3 rounded-lg h-32 overflow-y-auto space-y-1 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-gray-500">[{log.time}]</span>
              <span>{log.msg}</span>
            </div>
          ))}
          {logs.length === 0 && <span className="text-gray-500 italic">Haz clic en Producir o Consumir para iniciar...</span>}
        </div>
      </div>

    </div>
  );
};