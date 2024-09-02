import { Circle } from "react-konva";

interface SelectNodeProps {
  x: number;
  y: number;
  color: string; // outline color
  dash?: boolean;
}

const SelectNode = ({ x, y, color, dash }: SelectNodeProps) => {
  return dash ? (
    <Circle
      x={x}
      y={y}
      radius={20}
      stroke={color}
      strokeWidth={4}
      dash={[10, 5]}
    />
  ) : (
    <Circle x={x} y={y} radius={20} stroke={color} strokeWidth={4} />
  );
};

export default SelectNode;
