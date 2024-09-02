import { Line } from "react-konva";

interface SelectEdgeProps {
  points: number[];
  color: string; // outline color
  width?: number;
  dash?: boolean;
}

const SelectEdge = ({ points, color, width, dash }: SelectEdgeProps) => {
  const stroke = width ? width : 4;
  return dash ? (
    <Line points={points} stroke={color} strokeWidth={stroke} dash={[10, 5]} />
  ) : (
    <Line points={points} stroke={color} strokeWidth={stroke} />
  );
};

export default SelectEdge;
