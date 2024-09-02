import { RC } from "./ReturnCode";
// Graph datastructure (undirected) definition

export interface Node {
  id: number; // self-increment
  name: string;
  x: number;
  y: number;
}

export interface Edge {
  id: number; // self-increment
  name: string;
  from: number; // node identifier
  to: number;
  weight: number;
  line: number; // for metro
  color: string;
}

export class Graph {
  nodes: Node[];
  edges: Edge[];
  adjacencyList: {
    // adjacent list corresponding to each node (key[])
    [key: number]: {
      // key being the node id
      node: number;
      weight: number;
    }[];
  };
  nameToIDMap: { [key: string]: number };
  idToNameMap: string[];
  constructor(graph?: Graph) {
    if (graph) {
      // copy constructor
      this.nodes = [...graph.nodes];
      this.edges = [...graph.edges];
      this.adjacencyList = { ...graph.adjacencyList };
      this.nameToIDMap = { ...graph.nameToIDMap };
      this.idToNameMap = [...graph.idToNameMap];
    } else {
      // call default constructor
      this.nodes = [];
      this.edges = [];
      this.adjacencyList = {};
      this.nameToIDMap = {};
      this.idToNameMap = [];
    }
  }
  addNode(id: number, name: string, x: number, y: number): RC {
    if (name in this.nameToIDMap) {
      console.error("ERROR: duplicate name for nodes!");
      return RC.DUPLICATE_NODE;
    } else {
      const node: Node = { id, name, x, y };
      this.nodes.push(node);
      // initialize adjacent list
      this.adjacencyList[id] = [];
      this.nameToIDMap[name] = id;
      this.idToNameMap[id] = name;
      return RC.SUCCESS;
    }
  }

  addEdge(
    id: number,
    name: string,
    from: string | number,
    to: string | number,
    weight?: number,
    line?: number,
    color?: string
  ): RC {
    const edgeWeight = weight ? weight : 1;
    const edgeLine = line ? line : 1;
    const edgeColor = color ? color : "#000000";
    const rc = this.checkEdge(from, to, edgeWeight);
    if (rc != RC.SUCCESS) return rc;
    const fromId = typeof from === "string" ? this.nameToIDMap[from] : from;
    const toId = typeof to === "string" ? this.nameToIDMap[to] : to;
    // if (
    //   this.adjacencyList[fromId].some((toNode) => toNode.node === toId) ||
    //   this.adjacencyList[toId].some((fromNode) => fromNode.node === fromId)
    // ) {
    //   console.warn("Edge with same starting and ending point already existed!");
    //   console.log(`adding edges: from${fromId}to${toId}`)
    //   return RC.EDGE_EXISTS;
    // } else {
    //   const edge: Edge = {
    //     id: id,
    //     name: name,
    //     from: fromId,
    //     to: toId,
    //     weight: edgeWeight,
    //   };
    //   this.edges.push(edge);
    //   this.adjacencyList[fromId].push({ node: toId, weight: edgeWeight });
    //   this.adjacencyList[toId].push({ node: fromId, weight: edgeWeight });
    //   return RC.SUCCESS;
    // }
    const edge: Edge = {
      id: id,
      name: name,
      from: fromId,
      to: toId,
      weight: edgeWeight,
      line: edgeLine,
      color: edgeColor,
    };
    this.edges.push(edge);
    this.adjacencyList[fromId].push({ node: toId, weight: edgeWeight });
    this.adjacencyList[toId].push({ node: fromId, weight: edgeWeight });
    return RC.SUCCESS;
  }

  checkNode(name: string | number) {
    if (typeof name === "string") {
      if (!(name in this.nameToIDMap)) {
        console.error("ERROR: node not found in graph!");
        return RC.NODE_NOT_FOUND;
      }
    } else {
      if (name >= this.nodes.length) {
        console.error("ERROR: node not found in graph!");
        return RC.NODE_NOT_FOUND;
      }
    }
    return RC.SUCCESS;
  }

  checkEdge(from: string | number, to: string | number, weight?: number) {
    if (
      this.checkNode(from) !== RC.SUCCESS ||
      this.checkNode(to) !== RC.SUCCESS
    ) {
      console.error("ERROR: node not found in graph!");
      return RC.NODE_NOT_FOUND;
    } else if (from === to) {
      console.error("source and target cannot be the same node!");
      return RC.SAME_TARGET_SOURCE;
    }
    if (weight && weight <= 0) {
      console.error("edge weight has to be positive!");
      return RC.NEGATIVE_WEIGHT;
    }
    return RC.SUCCESS;
  }
}

// default graph for kruskal and prim
export function generateDefault(): Graph {
  const defaultGraph = new Graph();
  defaultGraph.addNode(0, "A", 300, 100);
  defaultGraph.addNode(1, "B", 100, 300);
  defaultGraph.addNode(2, "C", 100, 500);
  defaultGraph.addNode(3, "D", 300, 700);
  defaultGraph.addNode(4, "E", 500, 500);
  defaultGraph.addNode(5, "F", 500, 300);
  defaultGraph.addNode(6, "G", 700, 200);
  defaultGraph.addNode(7, "H", 700, 600);

  defaultGraph.addEdge(0, "A-B", "A", "B", 6);
  defaultGraph.addEdge(1, "A-F", "A", "F", 12);
  defaultGraph.addEdge(2, "B-F", "B", "F", 5);
  defaultGraph.addEdge(3, "B-D", "B", "D", 8);
  defaultGraph.addEdge(4, "B-C", "B", "C", 14);
  defaultGraph.addEdge(5, "C-D", "C", "D", 3);
  defaultGraph.addEdge(6, "D-E", "D", "E", 10);
  defaultGraph.addEdge(7, "E-F", "E", "F", 7);
  defaultGraph.addEdge(8, "F-G", "F", "G", 9);
  defaultGraph.addEdge(9, "E-H", "E", "H", 15);

  return defaultGraph;
}
