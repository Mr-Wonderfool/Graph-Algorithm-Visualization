import { Arrow, Layer, Rect, Stage, Text } from "react-konva";
import { Graph, Node } from "../models/Graph";
import { Fragment } from "react/jsx-runtime";

interface AdjacencyListProps {
  graph: Graph;
}
interface NodeWithTextProps {
  node?: Node;
  blockSize: number[];
  blockUpperLeft: number[];
  scaleHeight?: number;
}

const NodeWithText = ({
  node,
  blockSize,
  blockUpperLeft,
  scaleHeight,
}: NodeWithTextProps) => {
  const scale = scaleHeight ? scaleHeight : 1;
  const offset = ((1 - scale) * blockSize[1]) / 2;
  return (
    <>
      <Rect
        x={blockUpperLeft[0]}
        y={blockUpperLeft[1] + offset}
        width={blockSize[0]}
        height={blockSize[1] * scale}
        fill="white"
        stroke="black"
        strokeWidth={2}
      />
      <Text
        width={blockSize[0] * 0.8}
        height={blockSize[1] * 0.8}
        x={blockUpperLeft[0] + blockSize[0] / 10}
        y={blockUpperLeft[1] + offset + (blockSize[1] * scale) / 3}
        text={node ? node.name : "null"}
        align="center"
        fontSize={15}
        fill="black"
      />
    </>
  );
};

const AdjacencyListVisualizer = ({ graph }: AdjacencyListProps) => {
  const blockWidth = 73;
  const blockHeight = 45;
  const padding = 0; // distance between blocks
  const arrowLength = 50;
  return (
    <Stage width={window.innerWidth} height={window.innerHeight} draggable>
      <Layer>
        {graph.nodes.map((node, i) => {
          const startX = padding;
          const startY = padding + i * (blockHeight + padding);
          const neighborNum = graph.adjacencyList[node.id].length;
          const endX =
            startX +
            (neighborNum + 1) * arrowLength +
            (neighborNum + 1) * blockWidth;
          const endY = startY;
          return (
            <Fragment key={`adjacencylist-${node.id}`}>
              {/* block for each node */}
              <NodeWithText
                key={`${node.id}-startnode`}
                node={node}
                blockSize={[blockWidth, blockHeight]}
                blockUpperLeft={[startX, startY]}
              />
              {/* Arrows and neighbor blocks */}
              {graph.adjacencyList[node.id].map((neighborObj, j) => {
                const arrowStartX =
                  startX + j * arrowLength + (j + 1) * blockWidth;
                const arrowStartY = startY + blockHeight / 2;
                const neighborX = arrowStartX + arrowLength;
                const neighborY = arrowStartY - blockHeight / 2;
                const arrowEndX = neighborX;
                return (
                  <Fragment key={`list-for-node${j}`}>
                    <Arrow
                      key={`${j}-pointer`}
                      points={[
                        arrowStartX,
                        arrowStartY,
                        arrowEndX,
                        arrowStartY,
                      ]}
                      pointerLength={10}
                      pointerWidth={5}
                      fill="black"
                      stroke="black"
                      strokeWidth={2}
                    />
                    <NodeWithText
                      key={`${j}-nodeinlist`}
                      node={graph.nodes.find(
                        (node) => node.id === neighborObj.node
                      )}
                      blockUpperLeft={[neighborX, neighborY]}
                      blockSize={[blockWidth, blockHeight]}
                      scaleHeight={0.8}
                    />
                  </Fragment>
                );
              })}
              {/* null at the end of the linked list */}
              <Arrow
                points={[
                  endX - arrowLength,
                  endY + blockHeight / 2,
                  endX,
                  endY + blockHeight / 2,
                ]}
                pointerLength={10}
                pointerWidth={5}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
              <NodeWithText
                blockUpperLeft={[endX, endY]}
                blockSize={[blockWidth, blockHeight]}
                scaleHeight={0.8}
              />
            </Fragment>
          );
        })}
      </Layer>
    </Stage>
  );
};

export default AdjacencyListVisualizer;
