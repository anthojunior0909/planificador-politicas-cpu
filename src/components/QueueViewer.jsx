import { useEffect, useRef } from 'react';
import { Layers, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const QueueViewer = ({ historySlice, colorMap }) => {
  const scrollRef = useRef(null);

  // Auto-scroll suave hacia la derecha cada vez que avanza el tiempo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [historySlice?.length]);

  if (!historySlice || historySlice.length === 0) return null;

  // Obtenemos los datos exactos del milisegundo actual (el último del slice)
  const currentStepState = historySlice[historySlice.length - 1];
  const currentTime = currentStepState.time;
  const currentCpu = currentStepState.cpu;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      
      {/* Cabecera dinámica */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Pila Vertical (Tiempo: {currentTime})
        </h3>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-slate-800 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-slate-700 font-medium">
          <Cpu className="w-4 h-4" />
          <span>CPU actual: <strong className="text-blue-900 dark:text-white">{currentCpu || 'LIBRE'}</strong></span>
        </div>
      </div>

      {/* Contenedor de las pilas con scroll horizontal */}
      <div 
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl min-h-[140px] border border-gray-200 dark:border-gray-700 shadow-inner scroll-smooth custom-scrollbar items-start"
      >
        {historySlice.map((step, t) => {
          // Construimos la columna: El que ejecuta va arriba, la cola va debajo
          const activeAndQueue = [];
          if (step.cpu) activeAndQueue.push({ id: step.cpu, isCpu: true });
          if (step.queue) step.queue.forEach(qId => activeAndQueue.push({ id: qId, isCpu: false }));

          // Solo animamos la última columna (el instante actual) para no saturar la memoria
          const isLast = t === historySlice.length - 1;

          return (
            <div key={`stack-col-${t}`} className="flex flex-col items-center gap-1.5 shrink-0 w-10">
              
              {/* Etiqueta del Tiempo (t=0, t=1...) */}
              <div className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mb-1 border-b border-gray-300 dark:border-gray-600 w-full text-center pb-1">
                t={step.time}
              </div>
              
              {/* Círculos de los Procesos */}
              {activeAndQueue.map((item, idx) => (
                <motion.div
                  key={`queue-item-${t}-${idx}`}
                  // Si es el último paso, animamos la caída vertical
                  initial={isLast ? { opacity: 0, y: -15, scale: 0.8 } : false}
                  animate={isLast ? { opacity: 1, y: 0, scale: 1 } : false}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`text-[10px] font-bold flex items-center justify-center w-7 h-7 rounded-full border-2 shadow-sm ${
                    item.isCpu 
                      ? 'border-transparent text-white' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800'
                  }`}
                  style={{
                    backgroundColor: item.isCpu ? colorMap[item.id] : undefined,
                  }}
                  title={item.isCpu ? `Ejecutando ${item.id}` : `Esperando ${item.id}`}
                >
                  {item.id}
                </motion.div>
              ))}

              {/* Si la CPU está libre y no hay cola */}
              {activeAndQueue.length === 0 && (
                <div className="text-[10px] text-gray-400 dark:text-gray-600 italic mt-1">-</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};