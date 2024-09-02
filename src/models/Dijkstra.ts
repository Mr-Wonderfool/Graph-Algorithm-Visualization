import { Graph } from "./Graph";
import { PriorityQueue } from "./PriorityQueue";

export interface DijkstraStep {
  currNode: number; // output by pq
  currEdges: { from: number; to: number }[]; // the current relaxing edges
  distances: number[]; // for info canvas
  pq: PriorityQueue<number>; // for info canvas
}

export class Dijkstra {
  private graph: Graph;
  private distances: number[];
  private visited: boolean[];
  private parent: (number | null)[];
  private pq: PriorityQueue<number>;
  private currentEdges: { from: number; to: number }[];

  constructor(graph: Graph) {
    const nodeNum = graph.nodes.length;
    this.graph = graph;
    this.distances = Array(nodeNum).fill(Infinity);
    this.visited = Array(nodeNum).fill(false);
    this.parent = Array(nodeNum).fill(null);
    this.pq = new PriorityQueue<number>();
    this.currentEdges = [];
  }

  *step(sourceNode: string): Generator<DijkstraStep, void, undefined> {
    // ensure validity of source
    const source = this.graph.nameToIDMap[sourceNode];
    this.distances[source] = 0;
    this.pq.enqueue(source, this.distances[source]);
    while (!this.pq.isEmpty()) {
      const u = this.pq.dequeue();
      if (u !== null) {
        this.visited[u] = true;
        for (const neighbor of this.graph.adjacencyList[u]) {
          const v = neighbor.node;
          const weight = neighbor.weight;
          if (this.distances[v] > this.distances[u] + weight) {
            this.distances[v] = this.distances[u] + weight;
            if (this.parent[v] === null) {
              this.parent[v] = u;
              // not in pq yet, first exploration
              this.currentEdges.push({ from: u, to: v });
              this.pq.enqueue(v, this.distances[v]);
            } else {
              this.parent[v] = u;
              // if any previous edges leading to v, cancel display
              this.currentEdges = this.currentEdges.filter(
                (edge) => edge.to !== v
              );
              this.currentEdges.push({ from: u, to: v });
              this.pq.decreaseKey(v, this.distances[v]);
            }
          }
        }
        yield {
          currNode: u,
          currEdges: this.currentEdges,
          distances: this.distances,
          pq: this.pq,
        };
      }
    }
  }

  shortestPath(from: string, to: string) {
    const source = this.graph.nameToIDMap[from];
    const dest = this.graph.nameToIDMap[to];
    this.distances[source] = 0;
    this.pq.enqueue(source, this.distances[source]);
    while (true) {
      const currNode = this.pq.dequeue();
      if (currNode === dest) break;
      if (currNode !== null) {
        this.visited[currNode] = true;
        for (const neighbor of this.graph.adjacencyList[currNode]) {
          const v = neighbor.node;
          const weight = neighbor.weight;
          if (this.distances[v] > this.distances[currNode] + weight) {
            this.distances[v] = this.distances[currNode] + weight;
            this.parent[v] = currNode;
            this.pq.enqueue(v, this.distances[v]);
          }
        }
        if (this.pq.isEmpty()) {
          // pq being empty, and didnt reach dest
          console.error(`No feasible path from source to destination!`);
          return [];
        }
      }
    }
    const path = [];
    let traceBack = dest;
    while (traceBack !== source) {
      path.push(traceBack);
      traceBack = this.parent[traceBack]!;
    }
    path.push(source);
    path.reverse();
    return path;
  }
}
