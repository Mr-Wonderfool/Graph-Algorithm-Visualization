import { Table } from "react-bootstrap";
import { Graph } from "../models/Graph";
import routesData from "../assets/routes.json";

interface MetroPathInfoProps {
  graph: Graph;
  path: number[];
}

const MetroPathInfo = ({ graph, path }: MetroPathInfoProps) => {
  const pathDetails = path.map((nodeId, index) => {
    const node = graph.nodes.find((n) => n.id === nodeId)!;
    const nextNode =
      index < path.length - 1
        ? graph.nodes.find((n) => n.id === path[index + 1])
        : null;
    const edge = nextNode
      ? graph.edges.find(
          (e) =>
            (e.from === nodeId && e.to === nextNode.id) ||
            (e.from === nextNode.id && e.to === nodeId)
        )
      : null;

    return { node, edge };
  });

  return (
    <div className="info-canvas">
      <h3 className="text-center">空间距离最短乘车路径</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>站点名称</th>
            <th>所属线路</th>
            <th>下一站</th>
          </tr>
        </thead>
        <tbody>
          {pathDetails.map(({ node, edge }, index) => (
            <tr key={index}>
              <td>{node.name}</td>
              <td>
                {edge
                  ? routesData[edge.line]
                    ? `${routesData[edge.line].name}`
                    : `${edge.line}号线（新增）`
                  : "-"}
              </td>
              <td>
                {edge
                  ? // If the current node is `edge.from`, show `edge.to`, otherwise show `edge.from`
                    edge.from === node.id
                    ? graph.nodes.find((n) => n.id === edge.to)?.name
                    : graph.nodes.find((n) => n.id === edge.from)?.name
                  : "终点"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MetroPathInfo;
