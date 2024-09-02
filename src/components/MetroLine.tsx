import { ReactNode, useEffect, useState } from "react";
import { Graph } from "../models/Graph";
import { Layer, Line, Stage } from "react-konva";
import { constructMetroLine } from "../models/Metro";
import NodeDisplay from "./NodeDisplay";
import { Alert } from "react-bootstrap";

interface MetroLineProps {
  graph: Graph;
  setGraph: (graph: Graph) => void;
  metroConstructed: boolean;
  setMetroConstructed: (metroConstructed: boolean) => void;
  shortestPath?: number[];
}

const MetroLine = ({
  graph,
  setGraph,
  metroConstructed,
  setMetroConstructed,
  shortestPath,
}: MetroLineProps) => {
  const [alertVisible, setAlertVisibility] = useState(false);
  useEffect(() => {
    if (!metroConstructed) {
      const metroLine = new Graph();
      const [nodes, lines] = constructMetroLine();
      for (const node of nodes) {
        metroLine.addNode(node.id, node.name, node.x, node.y);
      }
      for (const line of lines) {
        for (const edge of line) {
          const fromNode = metroLine.nodes.find(
            (node) => node.id === edge.from
          )!;
          const toNode = metroLine.nodes.find((node) => node.id === edge.to)!;
          const deltaX = toNode.x - fromNode.x;
          const deltaY = toNode.y - fromNode.y;
          metroLine.addEdge(
            edge.id,
            edge.name,
            edge.from,
            edge.to,
            Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            edge.line,
            edge.color
          );
        }
      }
      setGraph(metroLine);
      setMetroConstructed(true);
    }
  }, [metroConstructed, setGraph, setMetroConstructed]);

  useEffect(() => {
    if (shortestPath && shortestPath.length === 0) {
      setAlertVisibility(true);
    }
  }, [shortestPath]);

  const shortestPathVisualization: ReactNode[] = [];
  if (shortestPath && shortestPath.length > 0) {
    const nodes = shortestPath.map((id) =>
      graph.nodes.find((node) => node.id === id)
    );
    for (let i = 0; i < nodes.length; ++i) {
      const curr = nodes[i];
      if (curr) {
        if (i !== nodes.length - 1) {
          const next = nodes[i + 1];
          if (next) {
            shortestPathVisualization.push(
              <Line
                key={`${curr.id}-line`}
                points={[curr.x, curr.y, next.x, next.y]}
                stroke="green"
                strokeWidth={5}
              />
            );
          }
        }
        shortestPathVisualization.push(
          <NodeDisplay
            key={`${curr.id}-node-highlight`}
            node={curr}
            fill="yellow"
            outline="black"
            radius={5}
          />
        );
      }
    }
  }
  return (
    <>
      <div className="graph-canvas">
        <Stage width={window.innerWidth} height={window.innerHeight} draggable>
          <Layer>
            {graph.edges.map((edge) => {
              const fromNode = graph.nodes.find(
                (node) => node.id === edge.from
              );
              const toNode = graph.nodes.find((node) => node.id === edge.to);
              return (
                fromNode &&
                toNode && (
                  <Line
                    key={`${edge.id}-line`}
                    points={[fromNode.x, fromNode.y, toNode.x, toNode.y]}
                    stroke={edge.color}
                    strokeWidth={2}
                  />
                )
              );
            })}
            {graph.nodes.map((node) => (
              <NodeDisplay
                key={`${node.id}-node`}
                node={node}
                fill="white"
                outline="black"
                radius={5}
              />
            ))}
          </Layer>
          <Layer>{shortestPathVisualization}</Layer>
        </Stage>
      </div>
      {alertVisible && (
        <Alert
          variant="danger"
          onClose={() => setAlertVisibility(false)}
          dismissible
        >
          不存在可行的换乘路线！
        </Alert>
      )}
    </>
  );
};

export default MetroLine;
