import { Queue } from '../datastructures/Queue.js';
import { calculatePreemptiveMetrics, calculateAverages } from '../utils/metrics.js';

export function runRoundRobin(processes, quantum = 2) {
  const pendingQueue = new Queue();
  const sorted = JSON.parse(JSON.stringify(processes)).sort((a, b) => a.tll - b.tll);
  sorted.forEach(p => pendingQueue.enqueue({ ...p, ti: null, tf: null, te: 0, lastExitedTime: null }));

  const readyQueue = new Queue();
  const history = [];
  const results = [];
  let currentTime = 0;
  let currentProcess = null;
  let currentQuantumUsage = 0;

  while (!pendingQueue.isEmpty() || !readyQueue.isEmpty() || currentProcess !== null) {
    const arrivedThisTick = new Queue();
    const tempPending = new Queue();

    while (!pendingQueue.isEmpty()) {
      const p = pendingQueue.dequeue();
      if (p.tll === currentTime) {
        arrivedThisTick.enqueue(p);
      } else {
        tempPending.enqueue(p);
      }
    }
    while (!tempPending.isEmpty()) {
      pendingQueue.enqueue(tempPending.dequeue());
    }

    let preemptedProcess = null;
    if (currentProcess !== null && currentQuantumUsage === quantum) {
      currentProcess.lastExitedTime = currentTime;
      preemptedProcess = currentProcess;
      currentProcess = null;
      currentQuantumUsage = 0;
    }

    // Regla de Round Robin: Nuevos primero, luego el expulsado
    while (!arrivedThisTick.isEmpty()) {
      readyQueue.enqueue(arrivedThisTick.dequeue());
    }
    if (preemptedProcess !== null) {
      readyQueue.enqueue(preemptedProcess);
    }

    if (currentProcess === null && !readyQueue.isEmpty()) {
      currentProcess = readyQueue.dequeue();
      currentQuantumUsage = 0;

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
      currentQuantumUsage += 1;

      if (currentProcess.restante === 0) {
        currentProcess.tf = currentTime + 1;
        
        const metrics = calculatePreemptiveMetrics(currentProcess.ti, currentProcess.tll, currentProcess.te, currentProcess.tf);
        
        results.push({ ...currentProcess, ...metrics });
        currentProcess = null;
        currentQuantumUsage = 0;
      }
    }

    currentTime++;
  }

  results.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return { history, results, averages: calculateAverages(results) };
}