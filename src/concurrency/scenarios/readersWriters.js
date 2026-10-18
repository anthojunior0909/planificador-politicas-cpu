import { Mutex } from '../Mutex.js';

export class ReadersWritersSimulation {
  constructor(onStateChange = null) {
    this.readCount = 0;          // Cantidad de lectores activos en la BD
    this.dbMutex = new Mutex();    // Exclusión mutua para la BD
    this.onStateChange = onStateChange; // Callback para notificar a React

    // Tiempos de ejecución personalizables (en milisegundos)
    this.readDuration = 3000;
    this.writeDuration = 3500;

    this.readers = [
      { id: 'R1', state: 'READY' },
      { id: 'R2', state: 'READY' },
      { id: 'R3', state: 'READY' }
    ];
    this.writers = [
      { id: 'W1', state: 'READY' },
      { id: 'W2', state: 'READY' }
    ];

    this.databaseValue = "Dato Inicial DB";
    this.logs = [];
  }

  setOnStateChange(callback) {
    this.onStateChange = callback;
  }

  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Permite configurar los tiempos de lectura y escritura desde la UI
  setDurations(readSec, writeSec) {
    this.readDuration = readSec * 1000;
    this.writeDuration = writeSec * 1000;
  }

  // --- INICIAR LECTURA ---
  startRead(readerId, syncEnabled = true) {
    const reader = this.readers.find(r => r.id === readerId);
    if (!reader) return false;

    if (reader.state.startsWith('BLOCKED') || reader.state === 'READING') {
      this.addLog(`[${readerId}] Ya está ejecutándose o bloqueado.`);
      this.notifyStateChange();
      return false;
    }

    if (syncEnabled) {
      // El primer lector bloquea la BD para evitar entrada de escritores
      if (this.readCount === 0) {
        const gotDb = this.dbMutex.lock(readerId);
        if (!gotDb) {
          this.updateThreadState(readerId, 'BLOCKED_DB');
          this.addLog(`[${readerId}] BD ocupada por un escritor. Hilo bloqueado.`);
          this.notifyStateChange();
          return false;
        }
      }
      this.readCount++;
    }

    this._executeRead(readerId, syncEnabled);
    return true;
  }

  _executeRead(readerId, syncEnabled) {
    this.updateThreadState(readerId, 'READING');
    this.addLog(`[${readerId}] Leyendo BD: "${this.databaseValue}"`);
    this.notifyStateChange();

    setTimeout(() => {
      this.stopRead(readerId, syncEnabled);
    }, this.readDuration);
  }

  // --- FINALIZAR LECTURA ---
  stopRead(readerId, syncEnabled = true) {
    this.updateThreadState(readerId, 'READY');
    this.addLog(`[${readerId}] Terminó de leer.`);

    if (syncEnabled) {
      this.readCount = Math.max(0, this.readCount - 1);

      // Si es el último lector en salir, libera la BD
      if (this.readCount === 0) {
        const wokenThreadId = this.dbMutex.unlock();
        if (wokenThreadId) {
          this.addLog(`[BD] Liberada por el último lector. Despertando a ${wokenThreadId}.`);
          this._resumeWokenThread(wokenThreadId, syncEnabled);
        }
      }
    }

    this.notifyStateChange();
  }

  // --- INICIAR ESCRITURA CON DATO PERSONALIZADO ---
  startWrite(writerId, customValue = null, syncEnabled = true) {
    const writer = this.writers.find(w => w.id === writerId);
    if (!writer) return false;

    if (writer.state.startsWith('BLOCKED') || writer.state === 'WRITING') {
      this.addLog(`[${writerId}] Ya está ejecutándose o bloqueado.`);
      this.notifyStateChange();
      return false;
    }

    if (syncEnabled) {
      const gotDb = this.dbMutex.lock(writerId);
      if (!gotDb) {
        this.updateThreadState(writerId, 'BLOCKED_DB');
        this.addLog(`[${writerId}] BD ocupada. Hilo bloqueado.`);
        this.notifyStateChange();
        return false;
      }
    }

    this._executeWrite(writerId, customValue, syncEnabled);
    return true;
  }

  _executeWrite(writerId, customValue, syncEnabled) {
    this.updateThreadState(writerId, 'WRITING');
    
    // Si el usuario escribió un texto propio, lo usa; de lo contrario usa el valor por defecto
    const newValue = customValue && customValue.trim() !== '' 
      ? customValue 
      : `Dato actualizado por ${writerId} (${new Date().toLocaleTimeString().slice(-5)})`;

    this.databaseValue = newValue;
    this.addLog(`[${writerId}] Escribiendo en BD: "${newValue}"`);
    this.notifyStateChange();

    setTimeout(() => {
      this.stopWrite(writerId, syncEnabled);
    }, this.writeDuration);
  }

  // --- FINALIZAR ESCRITURA ---
  stopWrite(writerId, syncEnabled = true) {
    this.updateThreadState(writerId, 'READY');
    this.addLog(`[${writerId}] Terminó de escribir.`);

    if (syncEnabled) {
      const wokenThreadId = this.dbMutex.unlock();
      if (wokenThreadId) {
        this.addLog(`[BD] Liberada por escritor. Despertando a ${wokenThreadId}.`);
        this._resumeWokenThread(wokenThreadId, syncEnabled);
      }
    }

    this.notifyStateChange();
  }

  _resumeWokenThread(threadId, syncEnabled) {
    const isReader = this.readers.some(r => r.id === threadId);
    if (isReader) {
      this.readCount++;
      this._executeRead(threadId, syncEnabled);
    } else {
      this._executeWrite(threadId, null, syncEnabled);
    }
  }

  updateThreadState(id, state) {
    const r = this.readers.find(x => x.id === id);
    if (r) r.state = state;
    const w = this.writers.find(x => x.id === id);
    if (w) w.state = state;
  }

  addLog(msg) {
    this.logs.unshift({ time: new Date().toLocaleTimeString(), msg });
    if (this.logs.length > 15) this.logs.pop();
  }

  getState() {
    return {
      readCount: this.readCount,
      databaseValue: this.databaseValue,
      isDbLocked: this.dbMutex.isLocked(),
      readers: [...this.readers],
      writers: [...this.writers],
      logs: [...this.logs]
    };
  }
}