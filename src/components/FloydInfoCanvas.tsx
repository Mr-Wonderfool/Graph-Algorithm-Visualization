import { Table } from "react-bootstrap";
import { Graph } from "../models/Graph";
import { FloydStep } from "../models/Floyd";
import "../App.css";

interface FloydInfoCanvasProps {
  graph: Graph;
  currentStep: FloydStep | null;
}

const FloydInfoCanvas = ({ graph, currentStep }: FloydInfoCanvasProps) => {
  if (!currentStep) {
    return null;
  }
  const { distances, i, j, k } = currentStep;

  return (
    <>
      <h3 className="text-center">
        <b>Floyd算法信息展示</b>
      </h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>节点</th>
            {graph.nodes.map((_, idx) => (
              <th key={idx}>{graph.idToNameMap[idx]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {distances.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{graph.idToNameMap[rowIndex]}</td>
              {row.map((dist, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    backgroundColor:
                      rowIndex === i && colIndex === j
                        ? "lightgreen"
                        : rowIndex === i && colIndex === k
                        ? "lightblue"
                        : "white",
                  }}
                >
                  {dist === Infinity ? "∞" : dist}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default FloydInfoCanvas;
