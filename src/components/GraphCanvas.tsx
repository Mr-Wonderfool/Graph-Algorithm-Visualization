// render Graph using react-konva
import { Layer, Stage } from "react-konva";
import { Graph, Node } from "../models/Graph";
import NodeDisplay from "./NodeDisplay";
import EdgeDisplay from "./EdgeDisplay";
import "../App.css";

interface GraphCanvasProps {
  graph: Graph;
  // display parameters
  edgeColor?: string;
  dash?: boolean;
  nodeColor?: string;
  nodeOutline?: string;
  children?: React.ReactNode;
}

const GraphCanvas = ({
  graph,
  edgeColor,
  dash,
  nodeColor,
  nodeOutline,
  children,
}: GraphCanvasProps) => {
  const edgeColor_ = edgeColor ? edgeColor : "black";
  const dash_ = dash ? true : false;
  const nodeColor_ = nodeColor ? nodeColor : "white";
  const nodeOutline_ = nodeOutline ? nodeOutline : "black";
  return (
    <div className="graph-canvas">
      <Stage width={window.innerWidth} height={window.innerHeight} draggable>
        <Layer>{children}</Layer>
        <Layer>
          {graph.edges.map((edge) => {
            const fromNode = graph.nodes.find((node) => node.id === edge.from);
            const toNode = graph.nodes.find((node) => node.id === edge.to);
            return (
              fromNode &&
              toNode && (
                <EdgeDisplay
                  key={`${edge.id}-edge`}
                  node1={fromNode}
                  node2={toNode}
                  edge={edge}
                  color={edgeColor_}
                  dash={dash_}
                />
              )
            );
          })}
          {graph.nodes.map((node: Node) => (
            <NodeDisplay
              node={node}
              key={`${node.id}-node`}
              fill={nodeColor_}
              outline={nodeOutline_}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default GraphCanvas;
