import { Queue } from '../datastructures/Queue.js';
import { PriorityQueue } from '../datastructures/PriorityQueue.js';
import { calculateNonPreemptiveMetrics, calculateAverages } from '../utils/metrics.js';

export function runSPN(processes) {
  const pendingQueue = new Queue();
  const sorted = JSON.parse(JSON.stringify(processes)).sort((a, b) => a.tll - b.tll);
  sorted.forEach(p => pendingQueue.enqueue({ ...p, ti: null, tf: null }));

  // Ordena por menor servicio. Si hay empate, por orden de llegada (TLL)
  const readyQueue = new PriorityQueue((a, b) => a.servicio - b.servicio || a.tll - b.tll);
  const history = [];
  const results = [];
  let currentTime = 0;
  let currentProcess = null;

  while (!pendingQueue.isEmpty() || !readyQueue.isEmpty() || currentProcess !== null) {
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

    if (currentProcess === null && !readyQueue.isEmpty()) {
      currentProcess = readyQueue.dequeue();
      if (currentProcess.ti === null) currentProcess.ti = currentTime;
    }

    history.push({
      time: currentTime,
      cpu: currentProcess ? currentProcess.id : null,
      queue: readyQueue.toArrayOfIds(),
    });

    if (currentProcess !== null) {
      currentProcess.restante -= 1;

      if (currentProcess.restante === 0) {
        currentProcess.tf = currentTime + 1;
        
        const metrics = calculateNonPreemptiveMetrics(currentProcess.ti, currentProcess.tll, currentProcess.tf);
        
        results.push({ ...currentProcess, ...metrics });
        currentProcess = null;
      }
    }

    currentTime++;
  }

  results.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return { history, results, averages: calculateAverages(results) };
}