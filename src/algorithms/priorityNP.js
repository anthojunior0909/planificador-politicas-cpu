import { Queue } from '../datastructures/Queue.js';
import { PriorityQueue } from '../datastructures/PriorityQueue.js';
import { calculateNonPreemptiveMetrics, calculateAverages } from '../utils/metrics.js';

export function runPriorityNP(processes) {
  const pendingQueue = new Queue();
  // Ordenamos los procesos por llegada inicial
  const sorted = JSON.parse(JSON.stringify(processes)).sort((a, b) => a.tll - b.tll);
  
  // Encolamos aplicando valores nulos iniciales y asegurando el atributo restante
  sorted.forEach(p => pendingQueue.enqueue({ 
    ...p, 
    ti: null, 
    tf: null,
    restante: p.servicio,
    prioridad: p.prioridad || 1 
  }));

  // Criterio de orden: Menor valor de prioridad primero. Si empatan, el que llegó antes (tll).
  const readyQueue = new PriorityQueue((a, b) => a.prioridad - b.prioridad || a.tll - b.tll);
  
  const history = [];
  const results = [];
  let currentTime = 0;
  let currentProcess = null;

  while (!pendingQueue.isEmpty() || !readyQueue.isEmpty() || currentProcess !== null) {
    // 1. Ingesta de procesos que llegan en el currentTime
    const tempPending = new Queue();
    while (!pendingQueue.isEmpty()) {
      const p = pendingQueue.dequeue();
      if (p.tll === currentTime) {
        readyQueue.enqueue(p);
      } else {
        tempPending.enqueue(p);
      }
    }
    while (!tempPending.isEmpty()) {
      pendingQueue.enqueue(tempPending.dequeue());
    }

    // 2. Si la CPU está libre, extraemos el de mayor prioridad
    if (currentProcess === null && !readyQueue.isEmpty()) {
      currentProcess = readyQueue.dequeue();
      if (currentProcess.ti === null) currentProcess.ti = currentTime;
    }

    // 3. Registrar estado histórico
    history.push({
      time: currentTime,
      cpu: currentProcess ? currentProcess.id : null,
      queue: readyQueue.toArrayOfIds(),
    });

    // 4. Procesar el tiempo en CPU
    if (currentProcess !== null) {
      currentProcess.restante -= 1;

      // Finalización del proceso
      if (currentProcess.restante === 0) {
        currentProcess.tf = currentTime + 1;
        
        // Calculamos TR y TE usando tu módulo de métricas
        const metrics = calculateNonPreemptiveMetrics(currentProcess.ti, currentProcess.tll, currentProcess.tf);
        
        results.push({ ...currentProcess, ...metrics });
        currentProcess = null;
      }
    }

    currentTime++;
  }

  // Ordenamiento final natural (P1, P2, P3... P10)
  results.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  
  return { 
    history, 
    results, 
    averages: calculateAverages(results) 
  };
}