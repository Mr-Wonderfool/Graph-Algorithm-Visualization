import { ReactNode, useEffect, useState } from "react";
import { Alert, Button, CloseButton, Form, InputGroup } from "react-bootstrap";
import { Graph } from "../models/Graph";
import { alertMessage, RC } from "../models/ReturnCode";
import { Dijkstra, DijkstraStep } from "../models/Dijkstra";
import SelectNode from "./SelectNode";
import SelectEdge from "./SelectEdge";
import GraphCanvas from "./GraphCanvas";
import "../style/visualization.css";
import InfoCanvas from "./InfoCanvas";

interface DijkstraDisplayProps {
  graph: Graph;
}

const DijkstraDisplay = ({ graph }: DijkstraDisplayProps) => {
  // set source node
  const [source, setSource] = useState("");
  const [alertVisible, setAlertVisibility] = useState(false);
  const [panelVisible, setPanelVisibility] = useState(true);
  const [ret, setRet] = useState(RC.MISSING_INFO);
  // dijkstra
  const [dijkstra, setDijkstra] = useState<Dijkstra>();
  const [stepGenerator, setStepGenerator] =
    useState<Generator<DijkstraStep, void, undefined>>();
  const [currentStep, setCurrentStep] = useState<DijkstraStep | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [exploredNodes, setExploredNodes] = useState<Array<number>>([]);
  const [exploredEdges, setExploredEdges] = useState<
    Array<{ from: number; to: number }>
  >([]);

  const dijkstraVisualizations: ReactNode[] = [];

  useEffect(() => {
    if (dijkstra) {
      setStepGenerator(dijkstra.step(source));
    }
  }, [dijkstra, source]);
  const handleClose = () => {
    if (ret === RC.SUCCESS) setPanelVisibility(false);
    else {
      setRet(RC.MISSING_INFO);
      setAlertVisibility(true);
    }
  };
  const handleAddSource = () => {
    let rc = RC.MISSING_INFO;
    rc = graph.checkNode(source);
    setRet(rc);
    if (rc !== RC.SUCCESS) {
      setAlertVisibility(true);
      setSource("");
    } else {
      setAlertVisibility(false);
      setPanelVisibility(false); // close panel automatically
      setDijkstra(new Dijkstra(graph));
    }
  };

  const handleNextStep = () => {
    if (stepGenerator) {
      const { value, done } = stepGenerator.next();
      if (value) {
        setCurrentStep(value);
        setExploredNodes([...exploredNodes, value.currNode]);
        setExploredEdges([...value.currEdges]);
      }
      if (done) {
        setIsComplete(true);
      }
    }
  };

  if (currentStep !== null) {
    dijkstraVisualizations.push(
      exploredNodes.map((vertexId) => (
        <SelectNode
          key={`vertex-${vertexId}`}
          x={graph.nodes[vertexId].x}
          y={graph.nodes[vertexId].y}
          color="red"
        />
      ))
    );
  }
  // edges currently being explored
  dijkstraVisualizations.push(
    exploredEdges.map((edge, index) => (
      <SelectEdge
        key={`explored-edge-${index}`}
        points={[
          graph.nodes[edge.from].x,
          graph.nodes[edge.from].y,
          graph.nodes[edge.to].x,
          graph.nodes[edge.to].y,
        ]}
        color="black"
        width={3}
      />
    ))
  );

  return (
    <>
      <div className="graph-canvas">
        <GraphCanvas graph={graph} edgeColor="#ddd" dash>
          {dijkstraVisualizations}
        </GraphCanvas>
        {panelVisible ? (
          <div className="input-panel">
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
                <CloseButton onClick={handleClose} />
              </div>
            )}
            <InputGroup className="mb-3">
              <InputGroup.Text>起点名称</InputGroup.Text>
              <Form.Control
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </InputGroup>
            <Button variant="outline-primary" onClick={handleAddSource}>
              确认
            </Button>
          </div>
        ) : (
          <>
            {!isComplete && ret === RC.SUCCESS && (
              <div className="continue">
                <Button onClick={handleNextStep} variant="outline-success">
                  继续Dijkstra算法
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="info-canvas">
        <InfoCanvas
          graph={graph}
          currentStep={currentStep}
          currentVertices={exploredNodes}
        />
      </div>
    </>
  );
};

export default DijkstraDisplay;
