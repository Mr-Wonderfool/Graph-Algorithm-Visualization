import { useState } from "react";
import { Form, Button, InputGroup, Alert, CloseButton } from "react-bootstrap";
import { Graph } from "../models/Graph";
import "../App.css";
import { alertMessage, RC } from "../models/ReturnCode";

interface PathPanelProps {
  graph: Graph;
  onFindPath: (start: string, end: string) => void;
  onClose: () => void;
}

const PathPanel = ({ graph, onFindPath, onClose }: PathPanelProps) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [alertVisible, setAlertVisibility] = useState(false);
  const [ret, setRet] = useState(RC.SUCCESS);

  const handleFindPath = () => {
    let rc = RC.MISSING_INFO;
    if (start && end) {
      rc = graph.checkEdge(start, end);
      if (rc !== RC.SUCCESS) {
        setAlertVisibility(true);
      } else {
        onFindPath(start, end);
        onClose();
        setAlertVisibility(false);
      }
    }
    if (rc === RC.SUCCESS) onClose();
    setStart("");
    setEnd("");
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
      <InputGroup className="mb-3">
        <InputGroup.Text>起点站</InputGroup.Text>
        <Form.Control
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>终点站</InputGroup.Text>
        <Form.Control
          type="text"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </InputGroup>
      <Button variant="outline-primary" onClick={handleFindPath}>
        查找换乘路径
      </Button>
    </div>
  );
};

export default PathPanel;
