import { generateDefault, Graph } from "./models/Graph";
import { useState } from "react";
import GraphCanvas from "./components/GraphCanvas";
import ControlPanel from "./components/ControlPanel";
import { Button } from "react-bootstrap";
import AdjacencyListVisualizer from "./components/AdjacencyList";
import "./App.css";
import PrimDisplay from "./components/PrimDisplay";
import KruskalDisplay from "./components/KruskalDisplay";
import DijkstraDisplay from "./components/DijkstraDisplay";
import MetroLine from "./components/MetroLine";
import PathPanel from "./components/PathPanel";
import { Dijkstra } from "./models/Dijkstra";
import MetroPathInfo from "./components/MetroPathInfo";
import FloydDisplay from "./components/FloydDisplay";

function App() {
  const [graph, setGraph] = useState(new Graph());
  const [panelVisible, setPanelVisibility] = useState<
    "addNode" | "addEdge" | null
  >(null);
  const [pathPanelVisible, setPathPanelVisibility] = useState(false);
  const [shortestPath, setShortestPath] = useState<number[]>();
  const [graphVisible, setGraphVisibility] = useState(false);
  const [adjacentListVisible, setAdjacentListVisibility] = useState(false);
  const [primVisible, setPrimVisibility] = useState(false);
  const [kruskalVisible, setKruskalVisibility] = useState(false);
  const [dijkstraVisible, setDijkstraVisibility] = useState(false);
  const [floydVisible, setFloydVisibility] = useState(false);
  const [metroVisible, setMetroVisibility] = useState(false);
  const [metroConstructed, setMetroConstructed] = useState(false);

  const handleHidePanel = () => {
    setPanelVisibility(null);
  };
  const handleClearInfo = () => {
    // set all visibility to false on the info canvas
    setAdjacentListVisibility(false);
    setPrimVisibility(false);
    setKruskalVisibility(false);
    setDijkstraVisibility(false);
    setFloydVisibility(false);
    if (!metroVisible) {
      // currently not rendering metro
      setGraphVisibility(true);
    }
    setShortestPath(undefined);
  };
  const handleShowPanel = (action: "addNode" | "addEdge") => {
    setPanelVisibility(action);
    setGraphVisibility(false);
    setPathPanelVisibility(false);
    handleClearInfo();
  };
  const handleShowDefault = () => {
    setMetroVisibility(false);
    setGraphVisibility(true);
    setGraph(generateDefault());
    setMetroConstructed(false); // regenerate the metro lines cause the graph changed
  };
  const handleAdjacency = () => {
    if (metroVisible) {
      handleShowDefault();
    }
    setAdjacentListVisibility(true);
  };
  const handlePrim = () => {
    handleClearInfo();
    if (metroVisible || graph.nodes.length === 0) {
      handleShowDefault();
    }
    setGraphVisibility(false);
    setPrimVisibility(true);
  };
  const handleKruskal = () => {
    handleClearInfo();
    if (metroVisible || graph.nodes.length === 0) {
      handleShowDefault();
    }
    setGraphVisibility(false);
    setKruskalVisibility(true);
  };
  const handleDijkstra = () => {
    handleClearInfo();
    if (metroVisible || graph.nodes.length === 0) {
      handleShowDefault();
    }
    setGraphVisibility(false);
    setDijkstraVisibility(true);
  };
  const handleFloyd = () => {
    handleClearInfo();
    if (metroVisible || graph.nodes.length === 0) {
      handleShowDefault();
    }
    setGraphVisibility(false);
    setFloydVisibility(true);
  };
  const handleMetro = () => {
    handleClearInfo();
    setGraphVisibility(false);
    setMetroVisibility(true);
  };
  const handlePathPanel = () => {
    if (metroVisible) {
      setPathPanelVisibility(true);
    }
  };
  const handleFindPath = (start: string, end: string) => {
    if (!metroVisible) {
      return;
    }
    const pathFinder = new Dijkstra(graph);
    const path = pathFinder.shortestPath(start, end);
    setShortestPath(path);
  };

  return (
    <div className="app d-flex">
      <div className="sidebar">
        <Button variant="primary" onClick={() => handleShowPanel("addNode")}>
          添加节点
        </Button>
        <Button variant="primary" onClick={() => handleShowPanel("addEdge")}>
          添加边
        </Button>
        <Button variant="secondary" onClick={handleShowDefault}>
          生成默认图
        </Button>
        <Button variant="info" onClick={handleAdjacency}>
          生成邻接链表
        </Button>
        <Button variant="info" onClick={handlePrim}>
          Prim算法
        </Button>
        <Button variant="info" onClick={handleKruskal}>
          Kruskal算法
        </Button>
        <Button variant="success" onClick={handleDijkstra}>
          单源最短路
        </Button>
        <Button variant="success" onClick={handleFloyd}>
          多源最短路
        </Button>
        <Button variant="danger" onClick={handleClearInfo}>
          清空信息页
        </Button>
      </div>
      <div className="app d-flex">
        <div className="metro-sidebar">
          <Button variant="warning" onClick={handleMetro}>
            展示地铁线路图
          </Button>
          <Button variant="success" onClick={handlePathPanel}>
            查找换乘路线
          </Button>
        </div>
      </div>
      <div className="content flex-grow-1">
        {panelVisible && (
          <ControlPanel
            graph={graph}
            setGraph={setGraph}
            panelType={panelVisible}
            onClose={handleHidePanel}
            isMetro={metroVisible}
          />
        )}
        {pathPanelVisible && (
          <PathPanel
            graph={graph}
            onFindPath={handleFindPath}
            onClose={() => setPathPanelVisibility(false)}
          />
        )}
      </div>
      <div>
        {graphVisible && <GraphCanvas graph={graph} />}
        {primVisible && <PrimDisplay graph={graph} />}
        {kruskalVisible && <KruskalDisplay graph={graph} />}
        {dijkstraVisible && <DijkstraDisplay graph={graph} />}
        {floydVisible && <FloydDisplay graph={graph} />}
        {metroVisible && (
          <MetroLine
            graph={graph}
            setGraph={setGraph}
            metroConstructed={metroConstructed}
            setMetroConstructed={setMetroConstructed}
            shortestPath={shortestPath}
          />
        )}
      </div>
      <div className="info-canvas">
        {adjacentListVisible && <AdjacencyListVisualizer graph={graph} />}
        {shortestPath && <MetroPathInfo graph={graph} path={shortestPath} />}
      </div>
    </div>
  );
}

export default App;
