import { Queue } from '../datastructures/Queue.js';

export class Mutex {
  constructor() {
    this.locked = false;
    this.owner = null;
    this.waitingQueue = new Queue();
  }

  lock(threadId) {
    if (!this.locked) {
      this.locked = true;
      this.owner = threadId;
      return true; // Acceso concedido
    }
    this.waitingQueue.enqueue(threadId);
    return false; // Hilo bloqueado en cola
  }

  unlock() {
    if (!this.locked) return null;

    if (!this.waitingQueue.isEmpty()) {
      this.owner = this.waitingQueue.dequeue();
      return this.owner; // Transfiere el candado al siguiente hilo
    } else {
      this.locked = false;
      this.owner = null;
      return null;
    }
  }

  isLocked() {
    return this.locked;
  }
}