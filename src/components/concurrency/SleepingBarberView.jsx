import { useState } from 'react';
import { Scissors, UserPlus, ShieldCheck, ShieldAlert, Clock, Armchair, Moon } from 'lucide-react';

export const SleepingBarberView = ({
  simulationState,
  onCustomerArrive,
  onDurationChange,
  syncEnabled,
  onToggleSync
}) => {
  const [cutDuration, setCutDuration] = useState(3);

  if (!simulationState) return null;

  const { barberState, currentCustomer, waitingRoom = [], numChairs = 3, logs = [] } = simulationState;

  const handleDurationChange = (sec) => {
    const val = Number(sec);
    setCutDuration(val);
    if (onDurationChange) {
      onDurationChange(val);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* BARRA SUPERIOR CON CONTROL DE TIEMPO DE CORTE */}
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

          {/* INPUT PARA TIEMPO PERSONALIZADO DE CORTE */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Tiempo de Corte:</span>
            <input
              type="number"
              min="1"
              max="15"
              value={cutDuration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="w-12 px-1.5 py-0.5 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 font-bold"
            />
            <span className="text-gray-500">s</span>
          </div>
        </div>

        <button
          onClick={onCustomerArrive}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="w-5 h-5" /> Llegada de Cliente
        </button>
      </div>

      {/* ÁREA INTERACTIVA: SILLA DEL BARBERO VS SALA DE ESPERA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SILLA PRINCIPAL DE BARBERÍA */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center min-h-[260px]">
          <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">
            Silla del Barbero
          </h4>

          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-md ${
            barberState === 'CUTTING'
              ? 'bg-amber-100 dark:bg-amber-900/40 border-4 border-amber-400 animate-pulse text-amber-600'
              : 'bg-blue-50 dark:bg-blue-900/30 border-4 border-blue-300 text-blue-500'
          }`}>
            {barberState === 'CUTTING' ? (
              <Scissors className="w-10 h-10 animate-spin" />
            ) : (
              <Moon className="w-10 h-10 text-indigo-400" />
            )}
          </div>

          <div className="font-mono text-sm font-bold">
            {barberState === 'CUTTING' ? (
              <span className="text-amber-600 dark:text-amber-400">
                Cortando pelo a: <strong>{currentCustomer?.id}</strong>
              </span>
            ) : (
              <span className="text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5 justify-center">
                <Moon className="w-4 h-4" /> Barbero Durmiendo (Sin Clientes)
              </span>
            )}
          </div>
        </div>

        {/* SALA DE ESPERA */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm">
                <Armchair className="w-5 h-5 text-blue-600" /> Sala de Espera
              </h4>
              <span className="font-mono text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md font-bold">
                Sillas: {waitingRoom.length} / {numChairs}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {Array.from({ length: numChairs }).map((_, idx) => {
                const customerInChair = waitingRoom[idx];
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                      customerInChair
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-dashed border-gray-300 dark:border-gray-700 text-gray-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase mb-1">Silla #{idx + 1}</span>
                    {customerInChair ? (
                      <>
                        <span className="font-bold text-xs">{customerInChair.id}</span>
                      </>
                    ) : (
                      <span className="text-xs italic">Vacía</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-gray-400 dark:text-gray-500 italic text-center">
            Si la sala de espera se llena (3/3), los nuevos clientes se irán inmediatamente.
          </p>
        </div>

      </div>

      {/* LOGS DE LA BARBERÍA */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm font-mono text-xs">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Logs de la Barbería</h4>
        <div className="bg-gray-900 text-gray-200 p-3 rounded-lg h-32 overflow-y-auto space-y-1 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-gray-500">[{log.time}]</span>
              <span>{log.msg}</span>
            </div>
          ))}
          {logs.length === 0 && <span className="text-gray-500 italic">Haz clic en "Llegada de Cliente" para iniciar...</span>}
        </div>
      </div>

    </div>
  );
};