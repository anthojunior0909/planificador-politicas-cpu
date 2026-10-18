import { Queue } from '../datastructures/Queue.js';

export class Semaphore {
  constructor(initialValue = 1) {
    this.value = initialValue;
    this.waitingQueue = new Queue();
  }

  // Operación Wait / P
  wait(threadId) {
    this.value--;
    if (this.value < 0) {
      this.waitingQueue.enqueue(threadId);
      return false; // Hilo bloqueado
    }
    return true; // Acceso concedido
  }

  // Operación Signal / V
  signal() {
    this.value++;
    if (this.value <= 0 && !this.waitingQueue.isEmpty()) {
      return this.waitingQueue.dequeue(); // Despierta al hilo
    }
    return null;
  }

  getValue() {
    return this.value;
  }
}