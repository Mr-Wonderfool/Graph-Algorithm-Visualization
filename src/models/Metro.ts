import routesData from "../assets/routes.json";
import stationsData from "../assets/stations.json";

export function constructMetroLine(): [
  {
    id: number;
    name: string;
    x: number;
    y: number;
  }[],
  {
    id: number;
    line: number;
    name: string;
    from: number;
    to: number;
    color: string;
  }[][]
] {
  const nodes = stationsData.map((station) => ({
    id: station.id - 1, // important! route start at vertex 0
    name: station.name,
    x: station.x,
    y: station.y,
  }));

  let edgeIndex = 0;
  const edges = routesData.map((route, index) => {
    const routeEdges = [];
    for (let i = 0; i < route.stations.length - 1; ++i) {
      const fromStation = route.stations[i];
      const toStation = route.stations[i + 1];
      routeEdges.push({
        id: edgeIndex++,
        line: index, // the metro line index
        name: `${fromStation}-${toStation}`,
        from: fromStation,
        to: toStation,
        color: route.color,
      });
    }
    return routeEdges;
  });

  return [nodes, edges];
}
