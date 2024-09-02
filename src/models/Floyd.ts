import { Graph } from "./Graph";

export interface FloydStep {
  k: number; // Current intermediate vertex
  i: number; // Source vertex
  j: number; // Destination vertex
  updated: boolean; // Whether the distance was updated
  distances: number[][]; // Distance matrix
}

export class Floyd {
  private distances: number[][];
  private numVertices: number;

  constructor(graph: Graph) {
    this.numVertices = graph.nodes.length;

    this.distances = Array(this.numVertices)
      .fill(null)
      .map((_, i) =>
        Array(this.numVertices)
          .fill(Infinity)
          .map((_, j) => (i === j ? 0 : Infinity))
      );

    graph.edges.forEach((edge) => {
      const { from, to, weight } = edge;
      this.distances[from][to] = weight;
      this.distances[to][from] = weight;
    });
  }

  *step(): Generator<FloydStep, void, undefined> {
    for (let k = 0; k < this.numVertices; ++k) {
      for (let i = 0; i < this.numVertices; ++i) {
        for (let j = 0; j < this.numVertices; ++j) {
          const oldDistance = this.distances[i][j];
          const newDistance = this.distances[i][k] + this.distances[k][j];
          const updated = newDistance < oldDistance;

          if (updated) {
            this.distances[i][j] = newDistance;
          }

          yield {
            k,
            i,
            j,
            updated,
            distances: this.distances.map((row) => [...row]),
          };
        }
      }
    }
  }
}
