import { useState } from 'react';
import { Database, BookOpen, Edit3, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

export const ReadersWritersView = ({ simulationState, onRead, onWrite, onDurationChange, syncEnabled, onToggleSync }) => {
  const [customText, setCustomText] = useState('');
  const [readDuration, setReadDuration] = useState(3);
  const [writeDuration, setWriteDuration] = useState(3);

  if (!simulationState) return null;

  const { readCount, databaseValue, readers, writers, logs } = simulationState;
  const isWriterActive = writers.some(w => w.state === 'WRITING');

  const handleDurationChange = (rSec, wSec) => {
    setReadDuration(rSec);
    setWriteDuration(wSec);
    if (onDurationChange) {
      onDurationChange(rSec, wSec);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* PANEL SUPERIOR DE CONFIGURACIÓN DE SINCRONIZACIÓN Y TIEMPOS */}
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
          {syncEnabled ? 'Sincronización ACTIVADA' : 'Sincronización DESACTIVADA (Condición de Carrera)'}
        </button>

        {/* AJUSTE PERSONALIZADO DE TIEMPOS DE OPERACIÓN */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Tiempo Lectura:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={readDuration}
              onChange={(e) => handleDurationChange(Number(e.target.value), writeDuration)}
              className="w-12 px-1.5 py-0.5 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 font-bold"
            />
            <span>s</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Tiempo Escritura:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={writeDuration}
              onChange={(e) => handleDurationChange(readDuration, Number(e.target.value))}
              className="w-12 px-1.5 py-0.5 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 font-bold"
            />
            <span>s</span>
          </div>
        </div>

        {/* ESTATUS DE LA BD */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 font-semibold">
            Lectores Activos: <strong>{readCount}</strong>
          </span>
          <span className={`px-3 py-1.5 rounded-lg border font-semibold ${
            isWriterActive
              ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
              : readCount > 0
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
              : 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
          }`}>
            Estado BD: <strong>
              {isWriterActive 
                ? 'OCUPADA (Escritor en uso)' 
                : readCount > 0 
                ? `EN LECTURA (${readCount} Lector${readCount > 1 ? 'es' : ''})` 
                : 'LIBRE'}
            </strong>
          </span>
        </div>
      </div>

      {/* ÁREA INTERACTIVA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LECTORES */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Hilos Lectores (Múltiples)
            </h4>
            <div className="space-y-2 mb-4">
              {readers.map((r) => (
                <div key={r.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{r.id}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    r.state === 'READING' ? 'bg-blue-500 text-white animate-pulse' :
                    r.state.startsWith('BLOCKED') ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {r.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {readers.map(r => (
              <button
                key={r.id}
                onClick={() => onRead(r.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                Leer ({r.id})
              </button>
            ))}
          </div>
        </div>

        {/* MONITOR DE LA BASE DE DATOS */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
          <Database className={`w-12 h-12 mb-3 transition-colors ${
            isWriterActive ? 'text-amber-500' : readCount > 0 ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">
            Recurso Compartido (Base de Datos)
          </h4>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 w-full mt-2 font-mono text-xs text-gray-700 dark:text-gray-300 break-words">
            {databaseValue}
          </div>
        </div>

        {/* ESCRITORES CON DATO PERSONALIZADO */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-600" /> Hilos Escritores (Exclusivo)
            </h4>

            {/* INPUT PARA PERSONALIZAR EL DATO A ESCRIBIR */}
            <div className="mb-3">
              <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                Dato Personalizado a Escribir:
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ej. Pepito el grillo"
                className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="space-y-2 mb-4">
              {writers.map((w) => (
                <div key={w.id} className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{w.id}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    w.state === 'WRITING' ? 'bg-amber-500 text-white animate-pulse' :
                    w.state.startsWith('BLOCKED') ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {w.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {writers.map(w => (
              <button
                key={w.id}
                onClick={() => onWrite(w.id, customText)}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                Escribir ({w.id})
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* LOGS */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm font-mono text-xs">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Logs de Acceso a BD</h4>
        <div className="bg-gray-900 text-gray-200 p-3 rounded-lg h-32 overflow-y-auto space-y-1 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-gray-500">[{log.time}]</span>
              <span>{log.msg}</span>
            </div>
          ))}
          {logs.length === 0 && <span className="text-gray-500 italic">Presiona los botones para iniciar lecturas/escrituras...</span>}
        </div>
      </div>

    </div>
  );
};