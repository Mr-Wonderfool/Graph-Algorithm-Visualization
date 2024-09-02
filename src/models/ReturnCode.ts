export enum RC {
  SUCCESS = 0,
  NODE_NOT_FOUND = 1,
  DUPLICATE_NODE = 2,
  SAME_TARGET_SOURCE = 3,
  NEGATIVE_WEIGHT = 4,
  MISSING_INFO = 5,
  EDGE_EXISTS = 6,
}

export const alertMessage = {
  [RC.SUCCESS]: "成功", // this is not supposed to be called
  [RC.NODE_NOT_FOUND]: "找不到一个或多个节点",
  [RC.DUPLICATE_NODE]: "同名节点已存在",
  [RC.SAME_TARGET_SOURCE]: "边起点与终点相同",
  [RC.NEGATIVE_WEIGHT]: "暂不支持负权边",
  [RC.MISSING_INFO]: "缺少必要信息",
  [RC.EDGE_EXISTS]: "同起点终点边已经存在",
};
