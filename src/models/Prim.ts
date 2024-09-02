import { Graph } from "./Graph";
import { PriorityQueue } from "./PriorityQueue";

export interface PrimStep {
  // one-step visualization for Prim
  vertexInMST: number; // current chosen vertex
  chosenEdge?: { from: number; to: number; weight: number };
  heap: { element: number; priority: number }[];
}

export class Prim {
  private graph: Graph;
  private mstSet: boolean[]; // chosen vertices for MST
  private parent: (number | null)[]; // for trace back
  private key: number[];
  private pq: PriorityQueue<number>;

  constructor(graph: Graph) {
    this.graph = graph;
    this.mstSet = Array(graph.nodes.length).fill(false);
    this.parent = Array(graph.nodes.length).fill(null);
    this.key = Array(graph.nodes.length).fill(Infinity);
    this.pq = new PriorityQueue<number>();
  }
  initialize(source: number) {
    // set s.key = 0 s.t. s is chosen first
    this.key[source] = 0;
    // initialize with all nodes in pq
    for (const node of this.graph.nodes) {
      this.pq.enqueue(node.id, this.key[node.id]);
    }
  }
  step(): PrimStep | null {
    if (this.pq.isEmpty() && this.isComplete()) {
      console.info("Prim reached last step!");
      return null;
    }
    const minNode = this.pq.dequeue();
    if (minNode === null) return null;
    if (this.key[minNode] === Infinity) {
      console.error("No feasible MST exists!");
      return null;
    }
    this.mstSet[minNode] = true;
    for (const each of this.graph.adjacencyList[minNode]) {
      // for every neighbor of u, if not chosen yet, decrease key
      const v = each.node,
        weight = each.weight;
      if (!this.mstSet[v] && each.weight < this.key[v]) {
        this.key[v] = weight;
        this.parent[v] = minNode;
        this.pq.decreaseKey(v, weight);
      }
    } // chosen edge
    const chosenEdge =
      null === this.parent[minNode]
        ? undefined
        : {
            from: this.parent[minNode],
            to: minNode,
            weight: this.key[minNode],
          };
    return {
      vertexInMST: minNode,
      chosenEdge: chosenEdge,
      heap: this.pq.getPriorityQueue(),
    };
  }
  isComplete(): boolean {
    return this.mstSet.every((v) => v);
  }
  getMST() {
    if (!this.isComplete()) {
      console.warn("MST construction not completed!");
      return null;
    }
    return this.parent;
  }
}
