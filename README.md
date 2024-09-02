### Graph Algorithm Visualization
This is a project built with `React` and `Vite`, aimed at visualizing certain graph algoritms to promote better understanding.
##### Usage
after cloning the repository, install node modules
```bash
cd repo
npm install
```
and start service on `localhost:3000`
```bash
npm run dev
```
##### Results
Algorithm      | Visualization                                                                  
------------ |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
**Prim Visualization** | ![Prim Visualization](images/prim算法运行过程.png)
**Kruskal Visualization** | ![Kruskal Visualization](images/kruskal算法运行过程.png)
**Dijkstra Visualization** | ![Dijkstra Visualization](images/dijkstra算法运行过程.png)
**Floyd Visualization** | ![Floyd Visualization](images/Floyd算法过程.png)
**Metro Lines** | ![Metro Lines](images/上海地铁线路图.png)
**Transfer Routes** | ![Transfer Routes](images/换乘路线图.png)
##### Algorithms
- Prim and Kruskal for MST
- Dijkstra for single source shortest path
- Floyd-Warshall for all pairs shortest path
##### Shanghai Metro Line Visualization
- We also built visualization for Shanghai Metro Lines, and support checking for transfor routes.
- The json file for metro lines and stations are stored in `./src/assets/`, feel free to download and visualize data in your preferable way.