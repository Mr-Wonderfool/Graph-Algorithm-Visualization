export class PriorityQueue<T> {
  private heap: { element: T; priority: number }[];

  constructor() {
    this.heap = [];
  }

  enqueue(element: T, priority: number): void {
    this.heap.push({ element, priority });
    // currently being the rightmost leaf, move towards the root
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | null {
    if (this.heap.length === 0) {
      console.warn("Calling dequeue() on empty heap!");
      return null;
    }
    if (this.heap.length === 1) {
      // only one element, no switch happing
      const ele = this.heap.pop();
      if (ele) {
        return ele.element;
      }
    }
    const root = this.heap[0];
    const end = this.heap.pop();
    if (end) {
      // for type check in ts
      this.heap[0] = end;
      this.bubbleDown(0); // change the position of the leaf switched up
    }
    return root.element;
  }

  peek(): T | null {
    return this.heap.length > 0 ? this.heap[0].element : null;
  }

  isEmpty(): boolean {
    return this.heap.length == 0;
  }

  decreaseKey(element: T, newPriority: number): void {
    const index = this.heap.findIndex((ele) => ele.element === element);
    if (-1 === index) {
      console.warn("Failed finding element in priority queue!");
      return;
    }
    if (this.heap[index].priority <= newPriority) {
      console.warn("Illegal decrease key operation!");
      return;
    }
    this.heap[index].priority = newPriority;
    this.bubbleUp(index);
  }

  getPriorityQueue() {
    return this.heap;
  }

  private bubbleUp(index: number): void {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2); // parent node index
      const parent = this.heap[parentIndex];
      if (element.priority >= parent.priority) break;
      // else exchange position
      this.heap[index] = parent;
      index = parentIndex;
    } // found position for element
    this.heap[index] = element;
  }
  private bubbleDown(index: number): void {
    const element = this.heap[index];
    while (this.hasLeft(index)) {
      let smallerChild = this.left(index);
      if (
        this.hasRight(index) &&
        this.heap[this.right(index)].priority <
          this.heap[this.left(index)].priority
      ) {
        smallerChild = this.right(index);
      }
      if (this.heap[smallerChild].priority >= element.priority) break;
      this.heap[index] = this.heap[smallerChild];
      index = smallerChild;
    }
    this.heap[index] = element;
  }

  private left(index: number) {
    return 2 * index + 1;
  }
  private right(index: number) {
    return 2 * index + 2;
  }
  private hasLeft(index: number) {
    return this.left(index) < this.heap.length;
  }
  private hasRight(index: number) {
    return this.right(index) < this.heap.length;
  }
  display() {
    // for bebugging purposes
    for (const each of this.heap) {
      console.log(`element:${each.element}, priority: ${each.priority}`);
    }
  }
}
