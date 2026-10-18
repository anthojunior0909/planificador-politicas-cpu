import { HardDrive, Cpu } from 'lucide-react';

export const MemorySpaceViewer = ({ threads = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
      <h3 className="text-md font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <HardDrive className="w-5 h-5 text-purple-600" /> Mapa del Espacio de Memoria de Hilos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ESPACIO COMPARTIDO DEL PROCESO PADRE */}
        <div className="md:col-span-1 p-4 bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl space-y-3">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block uppercase tracking-wider">
            Memoria Compartida del Proceso
          </span>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-white dark:bg-gray-900 rounded border border-purple-200 dark:border-purple-800/50 text-gray-700 dark:text-gray-300">
              <strong>.text (Código):</strong> Instrucciones compartidas
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded border border-purple-200 dark:border-purple-800/50 text-gray-700 dark:text-gray-300">
              <strong>.data (Globales):</strong> Mutex, Semáforos, Buffers
            </div>
            <div className="p-2 bg-white dark:bg-gray-900 rounded border border-purple-200 dark:border-purple-800/50 text-gray-700 dark:text-gray-300">
              <strong>Heap:</strong> Memoria Dinámica
            </div>
          </div>
        </div>

        {/* ESPACIOS PRIVADOS DE CADA HILO */}
        <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 block uppercase tracking-wider">
            Contexto Privado por Hilo (Stack & TCB)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {threads.map((t, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono space-y-1">
                <div className="flex justify-between items-center font-bold text-gray-800 dark:text-gray-200">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-purple-600" /> {t.id}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    t.state === 'RUNNING' || t.state === 'EATING' || t.state === 'READING' || t.state === 'WRITING' || t.state === 'SMOKING'
                      ? 'bg-emerald-500 text-white'
                      : t.state?.startsWith('BLOCKED')
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {t.state}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">Stack: 0x7FFF...{idx * 8}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">PC: L32_MutexCheck</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};