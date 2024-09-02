// user control for adding nodes and edges

import { Fragment, useState } from "react";
import { Graph } from "../models/Graph";
import { Form, Button, InputGroup, Alert, CloseButton } from "react-bootstrap";
import { alertMessage, RC } from "../models/ReturnCode";
import "../App.css";

interface ControlPanelProps {
  graph: Graph;
  setGraph: (graph: Graph) => void;
  panelType: "addNode" | "addEdge";
  onClose: () => void;
  isMetro?: boolean; // if currently rendering metro then use different panel
}

const ControlPanel = ({
  graph,
  setGraph,
  panelType,
  onClose,
  isMetro = false,
}: ControlPanelProps) => {
  const [nodeId, setNodeId] = useState(graph.nodes.length); // node index start at 0
  const [edgeId, setEdgeId] = useState(graph.edges.length);
  const [edgeName, setEdgeName] = useState(""); // allow empty input
  const [nodeName, setNodeName] = useState("");
  const [nodeX, setNodeX] = useState(""); // so intially wont display a value
  const [nodeY, setNodeY] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weight, setWeight] = useState("");
  const [alertVisible, setAlertVisibility] = useState(false); // warning mesage when adding nodes / edges
  const [ret, setRet] = useState(RC.SUCCESS);
  const [lineNumber, setLineNumber] = useState(
    Math.max(...graph.edges.map((edge) => edge.line)) + 1
  );
  const [color, setColor] = useState("#000000"); // Default color
  const addNode = () => {
    let rc = RC.MISSING_INFO;
    if (nodeName && nodeX && nodeY) {
      // construct new graph object reflecting the change
      const newGraph = new Graph(graph);
      rc = newGraph.addNode(nodeId, nodeName, Number(nodeX), Number(nodeY));
      if (rc != RC.SUCCESS) {
        setAlertVisibility(true);
      } else {
        setGraph(newGraph);
        setNodeId(nodeId + 1); // self-increment identifier
      }
    }
    setNodeName("");
    setNodeX("");
    setNodeY("");
    if (rc === RC.SUCCESS) onClose(); // else render alert information
    setRet(rc);
  };
  const addEdge = () => {
    let rc = RC.MISSING_INFO;
    if (from && to) {
      const newGraph = new Graph(graph);
      const name = edgeName ? edgeName : `${from}-${to}`;
      let edgeWeight = 1;
      if (!isMetro) {
        edgeWeight = weight ? Number(weight) : 1;
        rc = newGraph.addEdge(
          edgeId,
          name,
          from,
          to,
          edgeWeight,
          lineNumber,
          color
        );
      } else {
        const fromNode = graph.nodes.find((node) => node.name === from)!;
        const toNode = graph.nodes.find((node) => node.name === to)!;
        const deltaX = toNode.x - fromNode.x;
        const deltaY = toNode.y - fromNode.y;
        edgeWeight = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        rc = newGraph.addEdge(
          edgeId,
          name,
          fromNode.id,
          toNode.id,
          edgeWeight,
          lineNumber,
          color
        );
      }
      if (rc !== RC.SUCCESS) {
        setAlertVisibility(true);
      } else {
        setGraph(newGraph);
        setEdgeId(edgeId + 1);
        setLineNumber(lineNumber + 1);
      }
    }
    setEdgeName("");
    setFrom("");
    setTo("");
    setWeight("");
    if (rc === RC.SUCCESS) onClose();
    setRet(rc);
  };

  return (
    <div className="control-panel">
      {alertVisible ? (
        <Alert
          variant="danger"
          onClose={() => setAlertVisibility(false)}
          dismissible
        >
          {alertMessage[ret]}
        </Alert>
      ) : (
        <div className="d-flex justify-content-end">
          <CloseButton onClick={onClose} />
        </div>
      )}
      {panelType === "addNode" && (
        <Fragment>
          <InputGroup className="mb-3">
            <InputGroup.Text>节点编号</InputGroup.Text>
            <Form.Control readOnly disabled placeholder={String(nodeId)} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>节点名称</InputGroup.Text>
            <Form.Control
              type="text"
              required
              value={nodeName}
              placeholder="输入节点名称"
              onChange={(e) => setNodeName(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>节点x坐标</InputGroup.Text>
            <Form.Control
              placeholder={`x坐标需要在0-${window.innerWidth}之间`}
              value={nodeX}
              onChange={(e) => setNodeX(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>节点y坐标</InputGroup.Text>
            <Form.Control
              placeholder={`y坐标需要在0-${window.innerHeight}之间`}
              value={nodeY}
              onChange={(e) => setNodeY(e.target.value)}
            />
          </InputGroup>
          <Button variant="outline-primary" onClick={addNode}>
            添加节点
          </Button>
        </Fragment>
      )}
      {panelType === "addEdge" &&
        (!isMetro ? (
          <Fragment>
            <InputGroup className="mb-3">
              <InputGroup.Text>边编号</InputGroup.Text>
              <Form.Control readOnly disabled placeholder={String(edgeId)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>边名称</InputGroup.Text>
              <Form.Control
                placeholder="允许为空"
                type="text"
                value={edgeName}
                onChange={(e) => setEdgeName(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>节点1名称</InputGroup.Text>
              <Form.Control
                type="text"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>节点2名称</InputGroup.Text>
              <Form.Control
                type="text"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>边权重</InputGroup.Text>
              <Form.Control
                type="text"
                value={weight}
                placeholder="默认为1"
                onChange={(e) => setWeight(e.target.value)}
              />
            </InputGroup>
            <Button variant="outline-primary" onClick={addEdge}>
              添加边
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <InputGroup className="mb-3">
              <InputGroup.Text>边编号</InputGroup.Text>
              <Form.Control readOnly disabled placeholder={String(edgeId)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>线路编号</InputGroup.Text>
              <Form.Control
                readOnly
                disabled
                placeholder={String(lineNumber)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>起始站</InputGroup.Text>
              <Form.Control
                type="text"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>终到站</InputGroup.Text>
              <Form.Control
                type="text"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>线路颜色</InputGroup.Text>
              <Form.Control
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </InputGroup>
            <Button variant="outline-primary" onClick={addEdge}>
              添加线路
            </Button>
          </Fragment>
        ))}
    </div>
  );
};

export default ControlPanel;
