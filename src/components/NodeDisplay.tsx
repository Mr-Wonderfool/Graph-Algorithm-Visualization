import { useState } from "react";
import { Node } from "../models/Graph";
import { Circle, Rect, Text } from "react-konva";

interface NodeDisplayProps {
  node: Node;
  fill: string;
  outline: string;
  radius?: number;
}

interface ToolTipProps {
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

const ToolTip = ({ text, x, y, visible }: ToolTipProps) => {
  const padding = 5;
  const width = text.length * 15 + 2 * padding;
  const height = 15 + 2 * padding;
  const ulx = x - width / 2,
    uly = y - height - padding;
  return (
    visible && (
      <>
        <Rect
          key={`${text}-tooltip`}
          x={ulx}
          y={uly}
          width={width}
          height={height}
          fill="#dbe2ef"
          cornerRadius={5}
          opacity={0.8}
        />
        <Text
          key={`${text}-text`}
          text={text}
          x={ulx + padding}
          y={uly + padding}
          fill="black"
          fontSize={15}
          align="center"
          fontStyle="italic bold"
        />
      </>
    )
  );
};

const NodeDisplay = ({ node, fill, outline, radius }: NodeDisplayProps) => {
  const cirRadius = radius ? radius : 10;
  const [toolTipVisible, setToolTipVisibility] = useState(false);
  return (
    <>
      <Circle
        key={`${node.id}-node`}
        x={node.x}
        y={node.y}
        radius={cirRadius}
        fill={fill}
        stroke={outline}
        onMouseEnter={() => setToolTipVisibility(true)}
        onMouseLeave={() => setToolTipVisibility(false)}
      />
      <ToolTip
        text={node.name}
        x={node.x}
        y={node.y - 10}
        visible={toolTipVisible}
      />
    </>
  );
};

export default NodeDisplay;
