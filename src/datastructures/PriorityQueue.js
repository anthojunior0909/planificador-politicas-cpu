import { Node } from './Node.js';

export class PriorityQueue {
  constructor(comparator) {
    this.head = null;
    this.size = 0;
    this.comparator = comparator; 
  }

  enqueue(value) {
    const newNode = new Node(value);

    if (this.isEmpty() || this.comparator(value, this.head.value) < 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let current = this.head;
      while (
        current.next !== null &&
        this.comparator(value, current.next.value) >= 0
      ) {
        current = current.next;
      }
      newNode.next = current.next;
      current.next = newNode;
    }
    this.size++;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const removedValue = this.head.value;
    this.head = this.head.next;
    this.size--;
    return removedValue;
  }

  peek() {
    return this.isEmpty() ? null : this.head.value;
  }

  isEmpty() {
    return this.size === 0;
  }

  toArrayOfIds() {
    const ids = [];
    let current = this.head;
    while (current !== null) {
      ids.push(current.value.id);
      current = current.next;
    }
    return ids;
  }
}