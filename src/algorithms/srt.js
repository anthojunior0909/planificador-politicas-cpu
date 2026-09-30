import { Queue } from '../datastructures/Queue.js';
import { PriorityQueue } from '../datastructures/PriorityQueue.js';
import { calculatePreemptiveMetrics, calculateAverages } from '../utils/metrics.js';

export function runSRT(processes) {
  const pendingQueue = new Queue();
  const sorted = JSON.parse(JSON.stringify(processes)).sort((a, b) => a.tll - b.tll);
  sorted.forEach(p => pendingQueue.enqueue({ ...p, ti: null, tf: null, te: 0, lastExitedTime: null }));

  // Ordena por menor tiempo restante
  const readyQueue = new PriorityQueue((a, b) => a.restante - b.restante || a.tll - b.tll);
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

    // Evaluación de expulsión
    if (!readyQueue.isEmpty()) {
      const candidate = readyQueue.peek();
      if (currentProcess !== null && candidate.restante < currentProcess.restante) {
        currentProcess.lastExitedTime = currentTime;
        readyQueue.enqueue(currentProcess); 
        currentProcess = null;
      }
    }

    if (currentProcess === null && !readyQueue.isEmpty()) {
      currentProcess = readyQueue.dequeue();
      
      if (currentProcess.ti === null) {
        currentProcess.ti = currentTime;
      } else if (currentProcess.lastExitedTime !== null) {
        currentProcess.te += (currentTime - currentProcess.lastExitedTime);
        currentProcess.lastExitedTime = null;
      }
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
        
        const metrics = calculatePreemptiveMetrics(currentProcess.ti, currentProcess.tll, currentProcess.te, currentProcess.tf);
        
        results.push({ ...currentProcess, ...metrics });
        currentProcess = null;
      }
    }

    currentTime++;
  }

  results.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return { history, results, averages: calculateAverages(results) };
}