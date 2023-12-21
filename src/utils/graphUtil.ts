/**
 * 放大
 * @param graph
 */
export const handleZoomOut = (graph: any) => {
  if (!graph) return;
  const current = graph.getZoom();
  const canvas = graph.get('canvas');
  const point = canvas.getPointByClient(
    canvas.get('width') / 2,
    canvas.get('height') / 2
  );
  const pixelRatio = canvas.get('pixelRatio') || 1;
  const ratio = 1 + 0.05 * 5;
  if (ratio * current > 5) {
    return;
  }
  graph.zoom(ratio, {
    x: point.x / pixelRatio,
    y: point.y / pixelRatio,
  });
  return {
    text: `${Math.round(ratio * current * 100)}%`,
    ratio: ratio * current,
  };
};

/**
 * 缩小
 * @param graph
 */
export const handleZoomIn = (graph: any) => {
  if (!graph) return;
  const current = graph.getZoom();
  const canvas = graph.get('canvas');
  const point = canvas.getPointByClient(
    canvas.get('width') / 2,
    canvas.get('height') / 2
  );
  const pixelRatio = canvas.get('pixelRatio') || 1;
  const ratio = 1 - 0.05 * 5;
  if (ratio * current < 0.3) {
    return;
  }
  graph.zoom(ratio, {
    x: point.x / pixelRatio,
    y: point.y / pixelRatio,
  });

  return {
    text: `${Math.round(ratio * current * 100)}%`,
    ratio: ratio * current,
  };
};

/**
 * 实际大小
 * @param graph
 */
export const handleRealZoom = (graph: any) => {
  if (!graph) return;
  const current = graph.getZoom();
  graph.zoom(1 / current);
  graph.fitCenter();
  return {
    text: '100%',
    ratio: 1,
  };
};

/**
 * 自适应canvas大小
 */
export const handleAutoZoom = (graph: any) => {
  if (!graph) return;
  const nodes = graph.getNodes();
  if (nodes.length > 0) {
    graph.fitView([20, 20]);
  }
  const current = graph.getZoom();
  return {
    text: `${Math.round(current * 100)}%`,
    ratio: current,
  };
};

/**
 * 推拽后恢复布局
 * @param graph
 */
export const handleRefreshLayout = (graph: any) => {
  if (!graph) return;
  graph.layout();
};

/**
 * 下载图片
 * @param graph
 */
export const handleDownloadImage = (graph: any) => {
  if (!graph) return;
  graph.downloadFullImage('open-lineage', 'image/png', {
    padding: [30, 15, 15, 15],
  });
};

/**
 * 全屏查看
 */
export const handleEnterFullscreen = (container: any) => {
  console.log(
    '🚀 ~ file: graphUtil.ts:111 ~ handleEnterFullscreen ~ container:',
    container.requestFullscreen
  );
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.mozRequestFullScreen) {
    // Firefox
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    container.webkitRequestFullscreen();
  } else if (container.msRequestFullscreen) {
    // IE/Edge
    container.msRequestFullscreen();
  }
};

/**
 * 退出全屏
 */
export const handleExitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore Firefox
    document.mozCancelFullScreen();
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore Chrome, Safari and Opera
    document.webkitExitFullscreen();
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    // @ts-ignore IE/Edge
    document.msExitFullscreen();
  }
};

/**
 * 渲染视图
 */
export const renderGraph = (graph: any, lineageData: any) => {
  if (!graph || !lineageData) return;
  graph.data(lineageData);
  graph.render();
  graph.fitView();
};

/**
 * 设置文字水印
 * @param graph
 * @param text
 */
export const handleTextWaterMarker = (graph: any, text: string) => {
  if (!graph) return;
  graph.setTextWaterMarker(text);
};

/**
 * 设置连线高亮颜色
 * @param graph
 * @param color
 */
export const handleHighlightColor = (graph: any, color: string) => {
  if (!graph) return;
  // 查询所有选中的元素
  const edges = graph.findAll('edge', (item: any) => {
    return (
      item.getStates().length !== 0 &&
      item.getStates()[0].startsWith('highlight')
    );
  });
  if (edges) {
    edges.forEach((edge: any) =>
      graph.setItemState(edge, `highlight-${color}`, true)
    );
  }
};

/**
 * 清除状态
 */
export const clearAllStats = (graph: any) => {
  if (!graph) return;
  graph.setAutoPaint(false);
  // 清除节点状态
  graph.getNodes().forEach(function (node: any) {
    graph.clearItemStates(node);
  });
  // 清除边状态
  graph.getEdges().forEach(function (edge: any) {
    graph.clearItemStates(edge);
  });
  graph.paint();
  graph.setAutoPaint(true);
};

/**
 * 设置左边关联节点及边状态
 * @param edges 边
 */
export const setLeftStats = (
  graph: any,
  edges: any[],
  color: string,
  name: string
) => {
  if (!graph) return;
  edges.forEach(function (edge: any) {
    graph.setItemState(edge, `highlight-${color}`, true);
    edge.toFront();

    const sourceAnchor = edge.getModel()['sourceAnchor'];
    graph.setItemState(edge.getSource(), name + '-' + sourceAnchor, true);
  });
};

/**
 * 设置右边关联节点及边状态
 * @param edges 边
 */
export const setRightStats = (
  graph: any,
  edges: any[],
  color: string,
  name: string
) => {
  if (!graph) return;
  edges.forEach(function (edge: any) {
    graph.setItemState(edge, `highlight-${color}`, true);
    edge.toFront();

    const targetAnchor = edge.getModel()['targetAnchor'];
    graph.setItemState(edge.getTarget(), name + '-' + targetAnchor, true);
  });
};
