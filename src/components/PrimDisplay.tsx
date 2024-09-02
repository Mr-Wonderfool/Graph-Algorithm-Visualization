import { ReactNode, useEffect, useState } from "react";
import { Prim, PrimStep } from "../models/Prim";
import { Graph } from "../models/Graph";
import { Alert, Button } from "react-bootstrap";
import GraphCanvas from "./GraphCanvas";
import "../style/visualization.css";
import "../App.css";
import SelectEdge from "./SelectEdge";
import SelectNode from "./SelectNode";

interface PrimDisplayProps {
  graph: Graph;
}

const PrimDisplay = ({ graph }: PrimDisplayProps) => {
  const [prim, setPrim] = useState<Prim | null>(null);
  const [currentStep, setCurrentStep] = useState<PrimStep | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [mstVertices, setMstVertices] = useState<Array<number>>([]);
  const [mstEdges, setMstEdges] = useState<Array<{ from: number; to: number }>>(
    []
  );
  const [alertVisible, setAlertVisibility] = useState(false);
  useEffect(() => {
    const primInstance = new Prim(graph);
    primInstance.initialize(0);
    setPrim(primInstance);
  }, [graph]);
  const handleCloseAlert = () => {
    setAlertVisibility(false);
    setIsComplete(true);
  };
  const handleNextStep = () => {
    if (prim) {
      const step = prim.step();
      setCurrentStep(step);
      if (step === null && prim.isComplete()) {
        setIsComplete(true); // hide `next` button
        // hack for using slice(0, -1)
        setMstVertices([...mstVertices, mstVertices[-1]]);
        setMstEdges([...mstEdges, mstEdges[-1]]);
      }
      if (step === null && !prim.isComplete()) {
        setAlertVisibility(true);
      }
      if (step) {
        setMstVertices([...mstVertices, step.vertexInMST]);
        if (step.chosenEdge) {
          setMstEdges([
            ...mstEdges,
            { from: step.chosenEdge.from, to: step.chosenEdge.to },
          ]);
        }
      }
    }
  };
  const primVisualizations: ReactNode[] = [];
  if (currentStep?.chosenEdge !== undefined) {
    primVisualizations.push(
      <SelectEdge
        key={`${currentStep.chosenEdge.from}-${currentStep.chosenEdge.to}`}
        points={[
          graph.nodes[currentStep.chosenEdge.from].x,
          graph.nodes[currentStep.chosenEdge.from].y,
          graph.nodes[currentStep.chosenEdge.to].x,
          graph.nodes[currentStep.chosenEdge.to].y,
        ]}
        color="red"
        dash
      />
    );
  }
  if (currentStep !== null) {
    primVisualizations.push(
      <SelectNode
        key={`${currentStep.vertexInMST}`}
        x={graph.nodes[currentStep.vertexInMST].x}
        y={graph.nodes[currentStep.vertexInMST].y}
        color="red"
        dash
      />
    );
  }
  // persistently render chosen MST edges and nodes
  primVisualizations.push(
    mstVertices
      .slice(0, -1)
      .map((vertexId) => (
        <SelectNode
          key={`mst-vertex-${vertexId}`}
          x={graph.nodes[vertexId].x}
          y={graph.nodes[vertexId].y}
          color="red"
        />
      ))
  );
  // render selected edges in the MST
  primVisualizations.push(
    mstEdges
      .slice(0, -1)
      .map((edge, index) => (
        <SelectEdge
          key={`mst-edge-${index}`}
          points={[
            graph.nodes[edge.from].x,
            graph.nodes[edge.from].y,
            graph.nodes[edge.to].x,
            graph.nodes[edge.to].y,
          ]}
          color="green"
        />
      ))
  );
  return (
    <div className="graph-canvas">
      <GraphCanvas graph={graph}>{primVisualizations}</GraphCanvas>
      {!isComplete && (
        <div className="continue">
          {!alertVisible ? (
            <Button onClick={handleNextStep} variant="outline-success">
              继续Prim算法
            </Button>
          ) : (
            <Alert variant="danger" onClose={handleCloseAlert} dismissible>
              给定图不存在最小生成树！
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default PrimDisplay;
