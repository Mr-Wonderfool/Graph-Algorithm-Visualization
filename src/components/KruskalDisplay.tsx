import { ReactNode, useEffect, useState } from "react";
import { Edge, Graph } from "../models/Graph";
import { Kruskal, KruskalStep } from "../models/Kruskal";
import GraphCanvas from "./GraphCanvas";
import { Alert, Button } from "react-bootstrap";
import "../style/visualization.css";
import "../App.css";
import SelectEdge from "./SelectEdge";

interface KruskalDisplayProps {
  graph: Graph;
}

const KruskalDisplay = ({ graph }: KruskalDisplayProps) => {
  const [kruskal, setKruskal] = useState<Kruskal>();
  const [mstEdges, setMstEdges] = useState<Edge[]>([]);
  const [currentEdge, setCurrentEdge] = useState<Edge>();
  const [isCycle, setIsCycle] = useState(false);
  const [stepGenerator, setStepGenerator] =
    useState<Generator<KruskalStep, void, undefined>>();
  const [isComplete, setIsComplete] = useState(false);
  const [alertVisible, setAlertVisibility] = useState(false);

  useEffect(() => {
    const kruskalInstance = new Kruskal(graph);
    setKruskal(kruskalInstance);
    setStepGenerator(kruskalInstance.step());
  }, [graph]);
  const handleCloseAlert = () => {
    setAlertVisibility(false);
    setIsComplete(true);
  };
  const handleNextStep = () => {
    if (kruskal) {
      if (stepGenerator) {
        const { value, done } = stepGenerator.next();
        if (value) {
          setCurrentEdge(value.chosenEdge);
          setIsCycle(value.cycle);
          if (!value.cycle) {
            // edge is chosen, add to mst
            setMstEdges([...mstEdges, value.chosenEdge]);
          }
        }
        if (done) {
          if (kruskal.isComplete()) {
            setIsComplete(true);
          } else {
            setAlertVisibility(true);
          }
        }
      }
    }
  };
  const kruskalVisualizations: ReactNode[] = [];
  if (currentEdge) {
    if (!isCycle) {
      kruskalVisualizations.push(
        <SelectEdge
          key={`${currentEdge.from}-${currentEdge.to}`}
          points={[
            graph.nodes[currentEdge.from].x,
            graph.nodes[currentEdge.from].y,
            graph.nodes[currentEdge.to].x,
            graph.nodes[currentEdge.to].y,
          ]}
          color="green"
        />
      );
    } else {
      // red dashed line
      kruskalVisualizations.push(
        <SelectEdge
          key={`${currentEdge.from}-${currentEdge.to}`}
          points={[
            graph.nodes[currentEdge.from].x,
            graph.nodes[currentEdge.from].y,
            graph.nodes[currentEdge.to].x,
            graph.nodes[currentEdge.to].y,
          ]}
          color="red"
          dash
        />
      );
    }
  }
  kruskalVisualizations.push(
    mstEdges.map((edge, index) => (
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
      <GraphCanvas graph={graph}>{kruskalVisualizations}</GraphCanvas>
      {!isComplete && (
        <div className="continue">
          {!alertVisible ? (
            <Button onClick={handleNextStep} variant="outline-success">
              继续Kruskal算法
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

export default KruskalDisplay;
