import { Node } from './Node.js';

export class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  enqueue(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
    this.size++;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const removedValue = this.front.value;
    this.front = this.front.next;
    if (this.front === null) {
      this.rear = null;
    }
    this.size--;
    return removedValue;
  }

  peek() {
    return this.isEmpty() ? null : this.front.value;
  }

  isEmpty() {
    return this.size === 0;
  }

  toArrayOfIds() {
    const ids = [];
    let current = this.front;
    while (current !== null) {
      ids.push(current.value.id);
      current = current.next;
    }
    return ids;
  }
}