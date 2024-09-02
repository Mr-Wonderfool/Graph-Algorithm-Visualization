import { Edge, Graph } from "./Graph";

export interface KruskalStep {
  chosenEdge: Edge;
  cycle: boolean;
}

class UnionFind {
  parent: number[];
  rank: number[];

  constructor(size: number) {
    // each node being its own repr
    this.parent = Array(size)
      .fill(0)
      .map((_, i) => i);
    this.rank = Array(size).fill(0);
  }
  // find with path compression
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  // union by rank
  union(node1: number, node2: number): boolean {
    const parent1 = this.find(node1);
    const parent2 = this.find(node2);
    if (parent1 === parent2) {
      return false;
    }
    if (this.rank[parent1] > this.rank[parent2]) {
      this.parent[parent2] = parent1;
    } else if (this.rank[parent1] < this.rank[parent2]) {
      this.parent[parent1] = parent2;
    } else {
      this.parent[parent2] = parent1;
      ++this.rank[parent1];
    }
    return true;
  }
}

export class Kruskal {
  private graph: Graph;
  private edges: Edge[];
  private unionFind: UnionFind;
  private mstEdges: Edge[];

  constructor(graph: Graph) {
    this.graph = graph;
    this.edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    this.unionFind = new UnionFind(this.graph.nodes.length);
    this.mstEdges = [];
  }

  *step(): Generator<KruskalStep, void, undefined> {
    for (const edge of this.edges) {
      const cycle = !this.unionFind.union(edge.from, edge.to);
      if (!cycle) {
        // not in the same set yet
        this.mstEdges.push(edge);
      }
      yield { chosenEdge: edge, cycle: cycle };
      if (this.mstEdges.length === this.graph.nodes.length - 1) {
        console.info("finished building MST!");
        break;
      }
    }
  }

  isComplete() {
    return this.mstEdges.length === this.graph.nodes.length - 1;
  }
}
