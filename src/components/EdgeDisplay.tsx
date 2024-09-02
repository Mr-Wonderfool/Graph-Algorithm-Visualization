import { Line, Text } from "react-konva";
import { Edge, Node } from "../models/Graph";

interface EdgeDisplayProps {
  node1: Node;
  node2: Node;
  edge: Edge;
  color: string;
  dash?: boolean;
}

const EdgeDisplay = ({ node1, node2, edge, color, dash }: EdgeDisplayProps) => {
  return (
    <>
      {dash ? (
        <Line
          key={`${edge.id}-line`}
          points={[node1.x, node1.y, node2.x, node2.y]}
          stroke={color}
          dash={[10, 5]}
        />
      ) : (
        <Line
          key={`${edge.id}-line`}
          points={[node1.x, node1.y, node2.x, node2.y]}
          stroke={color}
        />
      )}
      <Text
        key={`${edge.id}-weight`}
        x={(node1.x + node2.x) / 2 - 15}
        y={(node1.y + node2.y) / 2 + 15}
        text={String(edge.weight)}
        fontSize={15}
        fill="black"
      />
    </>
  );
};

export default EdgeDisplay;
