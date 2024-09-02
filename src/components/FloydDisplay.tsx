import { ReactNode, useEffect, useState } from "react";
import { Graph } from "../models/Graph";
import { Button } from "react-bootstrap";
import { Floyd, FloydStep } from "../models/Floyd";
import SelectNode from "./SelectNode";
import SelectEdge from "./SelectEdge";
import GraphCanvas from "./GraphCanvas";
import FloydInfoCanvas from "./FloydInfoCanvas";

interface FloydDisplayProps {
  graph: Graph;
}

const FloydDisplay = ({ graph }: FloydDisplayProps) => {
  const [floyd, setFloyd] = useState<Floyd>();
  const [stepGenerator, setStepGenerator] =
    useState<Generator<FloydStep, void, undefined>>();
  const [currentStep, setCurrentStep] = useState<FloydStep | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const floydVisualizations: ReactNode[] = [];

  useEffect(() => {
    const floydInstance = new Floyd(graph);
    setFloyd(floydInstance);
    setStepGenerator(floydInstance.step());
  }, [graph]);

  const handleNextStep = () => {
    if (floyd && stepGenerator) {
      const { value, done } = stepGenerator.next();
      if (value) {
        setCurrentStep(value);
      }
      if (done) {
        setIsComplete(true);
      }
    }
  };

  if (currentStep !== null) {
    const { i, j, k, updated } = currentStep;
    const currentPath = [i, j];
    const viaNode = k;

    // Highlight nodes and edges involved in the current step
    floydVisualizations.push(
      currentPath.map((vertexId, index) => (
        <SelectNode
          key={`vertex-${vertexId}-${index}`}
          x={graph.nodes[vertexId].x}
          y={graph.nodes[vertexId].y}
          color={updated ? "red" : "blue"}
          dash={updated}
        />
      ))
    );

    if (updated) {
      floydVisualizations.push(
        <SelectEdge
          key={`edge-${i}-${j}`}
          points={[
            graph.nodes[i].x,
            graph.nodes[i].y,
            graph.nodes[j].x,
            graph.nodes[j].y,
          ]}
          color="green"
          width={5}
        />
      );
    }

    // Highlight the intermediate node used for the update
    floydVisualizations.push(
      <SelectNode
        key={`intermediate-${viaNode}-${i}-${j}`}
        x={graph.nodes[viaNode].x}
        y={graph.nodes[viaNode].y}
        color="yellow"
      />
    );
  }

  return (
    <>
      <div className="graph-canvas">
        <GraphCanvas graph={graph} edgeColor="#ddd" dash>
          {floydVisualizations}
        </GraphCanvas>
        {!isComplete && (
          <div className="continue">
            <Button onClick={handleNextStep} variant="outline-success">
              继续Floyd算法
            </Button>
          </div>
        )}
      </div>
      <div className="info-canvas">
        <FloydInfoCanvas graph={graph} currentStep={currentStep} />
      </div>
    </>
  );
};

export default FloydDisplay;
