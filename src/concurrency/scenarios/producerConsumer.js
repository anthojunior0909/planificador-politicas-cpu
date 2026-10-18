import { Semaphore } from '../Semaphore.js';

export class ProducerConsumerSimulation {
  constructor(onStateChange = null, bufferSize = 5) {
    this.onStateChange = onStateChange;
    this.bufferSize = bufferSize;
    this.buffer = new Array(bufferSize).fill(null);
    this.in = 0;
    this.out = 0;

    // Control de Mutex y Cola de Espera
    this.mutexLocked = false;
    this.mutexOwner = null;
    this.mutexQueue = [];

    // Semáforos contadores
    this.empty = new Semaphore(bufferSize); // Vacíos
    this.full = new Semaphore(0);           // Llenos

    this.produceDuration = 1000; // 1s
    this.consumeDuration = 1000; // 1s

    this.producers = [
      { id: 'P1', state: 'READY' },
      { id: 'P2', state: 'READY' }
    ];
    this.consumers = [
      { id: 'C1', state: 'READY' },
      { id: 'C2', state: 'READY' }
    ];

    this.logs = [];
    this.itemCounter = 1;
    this._syncSemaphoresWithBuffer();
  }

  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Sincroniza los valores de los semáforos con el estado real del buffer
  _syncSemaphoresWithBuffer() {
    const emptyCount = this.getEmptyCount();
    const fullCount = this.getFullCount();

    this.empty.value = emptyCount;
    this.full.value = fullCount;

    // Si hay espacios vacíos, desbloquea productores
    if (emptyCount > 0) {
      this.producers.forEach(p => {
        if (p.state === 'BLOCKED_EMPTY') p.state = 'READY';
      });
    }

    // Si hay elementos llenos, desbloquea consumidores
    if (fullCount > 0) {
      this.consumers.forEach(c => {
        if (c.state === 'BLOCKED_FULL') c.state = 'READY';
      });
    }
  }

  getEmptyCount() {
    return this.buffer.filter(slot => slot === null).length;
  }

  getFullCount() {
    return this.buffer.filter(slot => slot !== null).length;
  }

  setDurations(produceSec, consumeSec) {
    this.produceDuration = Math.max(0.5, produceSec) * 1000;
    this.consumeDuration = Math.max(0.5, consumeSec) * 1000;
  }

  // --- ACCIÓN DE PRODUCCIÓN ---
  produceItem(producerId, syncEnabled = true) {
    const producer = this.producers.find(p => p.id === producerId);
    if (!producer) return false;

    if (producer.state === 'RUNNING') return false;

    if (syncEnabled) {
      // Sincronizar antes de evaluar la condición
      this._syncSemaphoresWithBuffer();

      // 1. Verificar si realmente hay espacio en el buffer
      if (this.getEmptyCount() === 0) {
        this.updateThreadState(producerId, 'BLOCKED_EMPTY');
        this.addLog(`[${producerId}] Buffer totalmente lleno (5/5). Bloqueado en 'empty'.`);
        this.notifyStateChange();
        return false;
      }

      // 2. Intentar tomar Mutex
      if (this.mutexLocked) {
        if (!this.mutexQueue.includes(producerId)) {
          this.mutexQueue.push(producerId);
        }
        this.updateThreadState(producerId, 'BLOCKED_MUTEX');
        this.addLog(`[${producerId}] Sección Crítica ocupada. En cola esperando Mutex...`);
        this.notifyStateChange();
        return false;
      }

      this.mutexLocked = true;
      this.mutexOwner = producerId;
    } else if (this.getFullCount() >= this.bufferSize) {
      this.addLog(`⚠️ Carrera de datos: ${producerId} sobreescribió un ítem no consumido.`);
    }

    this._startProduction(producerId, syncEnabled);
    return true;
  }

  _startProduction(producerId, syncEnabled) {
    const item = `Item #${this.itemCounter++}`;
    this.buffer[this.in] = item;
    this.in = (this.in + 1) % this.bufferSize;

    this.updateThreadState(producerId, 'RUNNING');
    this.addLog(`[${producerId}] Produciendo ${item} (${this.produceDuration / 1000}s)...`);
    this.notifyStateChange();

    setTimeout(() => {
      this.updateThreadState(producerId, 'READY');

      if (syncEnabled) {
        this._syncSemaphoresWithBuffer();
        this._releaseMutexAndCheckNext(syncEnabled);
      }

      this.notifyStateChange();
    }, this.produceDuration);
  }

  // --- ACCIÓN DE CONSUMO ---
  consumeItem(consumerId, syncEnabled = true) {
    const consumer = this.consumers.find(c => c.id === consumerId);
    if (!consumer) return false;

    if (consumer.state === 'RUNNING') return false;

    if (syncEnabled) {
      // Sincronizar antes de evaluar
      this._syncSemaphoresWithBuffer();

      // 1. Verificar si hay elementos para consumir
      if (this.getFullCount() === 0) {
        this.updateThreadState(consumerId, 'BLOCKED_FULL');
        this.addLog(`[${consumerId}] Buffer totalmente vacío (0/5). Bloqueado en 'full'.`);
        this.notifyStateChange();
        return false;
      }

      // 2. Intentar tomar Mutex
      if (this.mutexLocked) {
        if (!this.mutexQueue.includes(consumerId)) {
          this.mutexQueue.push(consumerId);
        }
        this.updateThreadState(consumerId, 'BLOCKED_MUTEX');
        this.addLog(`[${consumerId}] Sección Crítica ocupada. En cola esperando Mutex...`);
        this.notifyStateChange();
        return false;
      }

      this.mutexLocked = true;
      this.mutexOwner = consumerId;
    } else if (this.getFullCount() === 0) {
      this.addLog(`⚠️ Carrera de datos: ${consumerId} intentó consumir de un buffer vacío.`);
      this.notifyStateChange();
      return false;
    }

    this._startConsumption(consumerId, syncEnabled);
    return true;
  }

  _startConsumption(consumerId, syncEnabled) {
    const item = this.buffer[this.out];
    this.buffer[this.out] = null;
    this.out = (this.out + 1) % this.bufferSize;

    this.updateThreadState(consumerId, 'RUNNING');
    this.addLog(`[${consumerId}] Consumiendo ${item || 'Ítem'} (${this.consumeDuration / 1000}s)...`);
    this.notifyStateChange();

    setTimeout(() => {
      this.updateThreadState(consumerId, 'READY');

      if (syncEnabled) {
        this._syncSemaphoresWithBuffer();
        this._releaseMutexAndCheckNext(syncEnabled);
      }

      this.notifyStateChange();
    }, this.consumeDuration);
  }

  // Libera el Mutex y transfiere el control inmediatamente al siguiente hilo en cola
  _releaseMutexAndCheckNext(syncEnabled) {
    this.mutexLocked = false;
    this.mutexOwner = null;

    if (this.mutexQueue.length > 0) {
      const nextThreadId = this.mutexQueue.shift();
      this.mutexLocked = true;
      this.mutexOwner = nextThreadId;

      this.addLog(`[Mutex] Cerrojo liberado y transferido automáticamente a ${nextThreadId}.`);

      if (nextThreadId.startsWith('P')) {
        this._startProduction(nextThreadId, syncEnabled);
      } else if (nextThreadId.startsWith('C')) {
        this._startConsumption(nextThreadId, syncEnabled);
      }
    }
  }

  updateThreadState(id, state) {
    const p = this.producers.find(x => x.id === id);
    if (p) p.state = state;
    const c = this.consumers.find(x => x.id === id);
    if (c) c.state = state;
  }

  addLog(msg) {
    this.logs.unshift({ time: new Date().toLocaleTimeString(), msg });
    if (this.logs.length > 15) this.logs.pop();
  }

  getState() {
    this._syncSemaphoresWithBuffer();
    return {
      buffer: [...this.buffer],
      count: this.getFullCount(),
      emptyValue: this.getEmptyCount(),
      fullValue: this.getFullCount(),
      isMutexLocked: this.mutexLocked,
      producers: [...this.producers],
      consumers: [...this.consumers],
      logs: [...this.logs]
    };
  }
}