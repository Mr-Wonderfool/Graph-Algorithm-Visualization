import { Table } from "react-bootstrap";
import { DijkstraStep } from "../models/Dijkstra";
import "../App.css";
import { Graph } from "../models/Graph";

interface InfoCanvasProps {
  graph: Graph;
  currentStep: DijkstraStep | null;
  currentVertices: number[]; // nodes with a confirmed shortest path
}

const InfoCanvas = ({
  graph,
  currentStep,
  currentVertices,
}: InfoCanvasProps) => {
  if (!currentStep) {
    return null;
  }
  const { pq, distances } = currentStep;
  const pqNode = pq.getPriorityQueue();

  return (
    <div className="info-canvas">
      <h3 className="text-center">
        <b>Dijkstra算法信息展示</b>
      </h3>
      {/* Priority Queue Table */}
      <h5>
        <i>优先队列</i>
      </h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>节点名称</th>
            <th>优先级</th>
          </tr>
        </thead>
        <tbody>
          {pqNode.map((node, index) => (
            <tr key={index}>
              <td>{graph.idToNameMap[node.element]}</td>
              <td>{node.priority}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Distances Table */}
      <h5>
        <i>与起始点距离</i>
      </h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>节点名称</th>
            <th>当前与源点距离</th>
          </tr>
        </thead>
        <tbody>
          {distances.map((distance, index) => (
            <tr key={index}>
              <td>
                {currentVertices.includes(index) ? (
                  <b>{graph.idToNameMap[index]}</b>
                ) : (
                  graph.idToNameMap[index]
                )}
              </td>
              <td>
                {currentVertices.includes(index) ? (
                  <b>{distance === Infinity ? "∞" : distance}</b>
                ) : distance === Infinity ? (
                  "∞"
                ) : (
                  distance
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InfoCanvas;
