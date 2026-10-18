export class DiningPhilosophersSimulation {
  constructor(onStateChange = null) {
    this.onStateChange = onStateChange;

    // Estado de los 5 palillos: false = libre (naranja), true = en uso (rojo)
    // Cubierto i se ubica entre Filósofo i y Filósofo (i+1)%5
    this.chopsticks = [false, false, false, false, false];
    this.chopstickOwners = [null, null, null, null, null];

    this.philosophers = [
      { id: 0, name: 'Filósofo 0', state: 'THINKING' },
      { id: 1, name: 'Filósofo 1', state: 'THINKING' },
      { id: 2, name: 'Filósofo 2', state: 'THINKING' },
      { id: 3, name: 'Filósofo 3', state: 'THINKING' },
      { id: 4, name: 'Filósofo 4', state: 'THINKING' }
    ];

    this.logs = [];
    this.eatDuration = 3000; // Tiempo por defecto (3s)
  }

  notifyStateChange() {
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  // Método para actualizar la duración desde la UI
  setEatDuration(seconds) {
    this.eatDuration = Math.max(1, seconds) * 1000;
  }

  takeChopsticks(id, syncEnabled = true) {
    const p = this.philosophers[id];
    if (!p) return;

    if (p.state === 'EATING') {
      this.releaseChopsticks(id);
      return;
    }

    if (p.state === 'BLOCKED') {
      this.addLog(`[${p.name}] Está BLOQUEADO. Espera a que sus vecinos liberen sus cubiertos.`);
      this.notifyStateChange();
      return;
    }

    // Cubierto izquierdo = (id + 4) % 5, Cubierto derecho = id
    const left = (id + 4) % 5;
    const right = id;

    if (!syncEnabled) {
      this.chopsticks[left] = true;
      this.chopsticks[right] = true;
      this.chopstickOwners[left] = id;
      this.chopstickOwners[right] = id;
      p.state = 'EATING';
      this.addLog(`⚠️ Carrera de Datos: [${p.name}] tomó cubiertos ${left} y ${right} sin exclusión mutua.`);
      this.notifyStateChange();
      return;
    }

    const leftFree = !this.chopsticks[left];
    const rightFree = !this.chopsticks[right];

    if (leftFree && rightFree) {
      this.chopsticks[left] = true;
      this.chopsticks[right] = true;
      this.chopstickOwners[left] = id;
      this.chopstickOwners[right] = id;

      p.state = 'EATING';
      this.addLog(`[${p.name}] Tomó cubiertos ${left} (izq) y ${right} (der). ¡Comiendo por ${this.eatDuration / 1000}s! 🍝`);
      this.notifyStateChange();

      setTimeout(() => {
        if (p.state === 'EATING') {
          this.releaseChopsticks(id);
        }
      }, this.eatDuration);

    } else {
      p.state = 'BLOCKED';
      const busyIndex = !leftFree ? left : right;
      this.addLog(`[${p.name}] No pudo comer (Cubierto ${busyIndex} ocupado). Estado: BLOQUEADO.`);
      this.notifyStateChange();
    }
  }

  releaseChopsticks(id) {
    const p = this.philosophers[id];
    if (!p) return;

    const left = (id + 4) % 5;
    const right = id;

    if (this.chopstickOwners[left] === id) {
      this.chopsticks[left] = false;
      this.chopstickOwners[left] = null;
    }
    if (this.chopstickOwners[right] === id) {
      this.chopsticks[right] = false;
      this.chopstickOwners[right] = null;
    }

    p.state = 'THINKING';
    this.addLog(`[${p.name}] Liberó cubiertos ${left} y ${right} y volvió a pensar.`);
    this.notifyStateChange();

    const leftNeighbor = (id + 4) % 5;
    const rightNeighbor = (id + 1) % 5;

    if (this.philosophers[leftNeighbor].state === 'BLOCKED') {
      this._retryNeighbor(leftNeighbor);
    }
    if (this.philosophers[rightNeighbor].state === 'BLOCKED') {
      this._retryNeighbor(rightNeighbor);
    }
  }

  _retryNeighbor(id) {
    const p = this.philosophers[id];
    const left = (id + 4) % 5;
    const right = id;

    if (!this.chopsticks[left] && !this.chopsticks[right]) {
      p.state = 'THINKING';
      this.takeChopsticks(id, true);
    }
  }

  forceDeadlock() {
    for (let i = 0; i < 5; i++) {
      this.chopsticks[i] = true;
      this.chopstickOwners[i] = i;
      this.philosophers[i].state = 'BLOCKED';
    }
    this.addLog(`🚨 DEADLOCK: Todos los filósofos tomaron 1 cubierto. Ninguno puede comer.`);
    this.notifyStateChange();
  }

  addLog(msg) {
    this.logs.unshift({ time: new Date().toLocaleTimeString(), msg });
    if (this.logs.length > 15) this.logs.pop();
  }

  getState() {
    return {
      chopsticks: [...this.chopsticks],
      chopstickOwners: [...this.chopstickOwners],
      philosophers: [...this.philosophers],
      logs: [...this.logs]
    };
  }
}