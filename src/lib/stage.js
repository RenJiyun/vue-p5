import * as mm from "./mode_manager";
import * as eb from "./event_bus";
import MKTrap from "./mktrap";
import Scene from "./scene";
import constants from "./constants";
import * as mh from "./math_helper";

let _p5;

// 舞台宽度
let _w;

// 舞台高度
let _h;

// 舞台背景颜色
let _bg;

/**
 * 舞台中所有的场景
 *
 * @type {Array}
 */
let _scenes = [];

/**
 * 各个场景的堆叠顺序
 *
 * 场景编号在该数组中越靠后，则该场景越晚被绘制，这意味着这个场景在舞台中越靠前
 *
 * @type {Array}
 */
let _pileOrder = [];

function _toStageCoord(coord) {
  let [x, y] = coord;
  return [x - _w / 2, y - _h / 2];
}

function _selectScene(coord) {
  for (let i = _pileOrder.length - 1; i >= 0; i--) {
    let scene = _scenes[_pileOrder[i]];
    if (mh.within(coord, [scene.x, scene.y, scene.width, scene.height])) {
      unselectScene(..._pileOrder);
      selectScene(scene.sid);
      return;
    }
  }
  unselectScene(..._pileOrder);
}

function _multiSelectScene(coord) {
  for (let i = _pileOrder.length - 1; i >= 0; i--) {
    let scene = _scenes[_pileOrder[i]];
    if (mh.within(coord, [scene.x, scene.y, scene.width, scene.height])) {
      selectScene(scene.sid);
      return;
    }
  }
}

function _checkSceneEdge(coord) {
  for (let i = _pileOrder.length - 1; i >= 0; i--) {
    let scene = _scenes[_pileOrder[i]];
    if (_isSceneEdge(coord, scene)) {
      _p5.cursor("grab");
    } else {
      _p5.cursor("");
    }
  }
}

function _isSceneEdge(coord, scene) {
  let position = mh.position(
    coord,
    [scene.x, scene.y, scene.width, scene.height],
    3
  );
  return position.indexOf(true) != -1 && !position[8];
}

function _dragScene(start, end) {
  let v = [end[0] - start[0], end[1] - start[1]];
  for (let i = _pileOrder.length - 1; i >= 0; i--) {
    let scene = _scenes[_pileOrder[i]];
    if (mh.within(start, [scene.x, scene.y, scene.width, scene.height])) {
      moveScene(scene.sid, v);
      return;
    }
  }
}

function _scaleScene(start, end) {
  let v = [end[0] - start[0], end[1] - start[1]];
  for (let i = _pileOrder.length - 1; i >= 0; i--) {
    let scene = _scenes[_pileOrder[i]];
    if (_isSceneEdge(start, scene)) {
      console.log(v);
      scaleScene(scene.sid, ...v);
      return;
    }
  }
}

function _installStageEditMode() {
  let mkt = new MKTrap();

  // mkt.registerCustomEventTypes([
  //   {
  //     name: "selected",
  //     type: "custom",
  //     priority: 0,
  //     instant: true,
  //     negative: () => false,
  //     match: function(e) {
  //       return e.name == "selected";
  //     },
  //   },
  //   { name: "unselected", type: "custom", priority: 1, negative: () => false },
  //   { name: "edgeHover", type: "custom", priority: 1, negative: () => false },
  //   { name: "unedgeHover", type: "custom", priority: 2, negative: () => false },
  // ]);

  mkt.bind(
    "down",
    (e) => {
      let coord = _toStageCoord(e.params.coord);
      _selectScene(coord);
    },
    null,
    0,
    "鼠标按下，用于场景选择"
  );

  mkt.bind(
    "moved",
    (e) => {
      let coord = _toStageCoord(e.params.coord);
      _checkSceneEdge(coord);
    },
    null,
    1,
    "鼠标移动，检测是否位于场景边缘"
  );

  mkt.bind(
    "ctrl[p] a",
    () => {
      selectScene(..._pileOrder);
    },
    null,
    0,
    "全选场景"
  );

  mkt.bind(
    "shift[p] down",
    (e) => {
      let coord = _toStageCoord(e.params.coord);
      _multiSelectScene(coord);
    },
    null,
    0,
    "多选场景"
  );
  mkt.bind(
    "dragged",
    (e) => {
      let start = _toStageCoord(e.params.start);
      let end = _toStageCoord(e.params.end);
      _dragScene(start, end);
    },
    null,
    1,
    "拖拽场景"
  );

  mkt.bind(
    "dragged",
    (e) => {
      let start = _toStageCoord(e.params.start);
      let end = _toStageCoord(e.params.end);
      _scaleScene(start, end);
    },
    (e) => {
      let start = _toStageCoord(e.params.start);
      let result = _pileOrder.some((sid) => {
        let scene = _scenes[sid];
        return _isSceneEdge(start, scene);
      });
      return result;
    },
    0,
    "缩放场景"
  );
  // mkt.bind("space n", () => {}, "创建场景");
  // mkt.bind("selected space c", () => {}, "复制场景");
  // mkt.bind("selected space h", () => {}, "隐藏场景");
  // mkt.bind("space s", () => {}, "显示场景");
  // mkt.bind("selected space d", () => {}, "删除场景");
  // mkt.bind("selected space f", () => {}, "全屏化场景");
  // mkt.bind("esc", () => {});
  // mkt.bind("ctrl[d] z", () => {});
  // mkt.bind(
  //   "doubleClicked",
  //   () => {},
  //   "进入场景编辑模式，此后事件由场景编辑模式接管，直到该场景退出"
  // );

  // mkt.bind("dragged", (e) => {
  //   console.log(e);
  // });

  mm.push(mkt.build());
}

function _selected() {
  return _scenes.filter((s) => s.selected).map((s) => s.sid);
}

/**
 * 舞台初始化
 *
 * @param {*} p5
 * @param {Number} w
 * @param {Number} h
 * @param {Array} bg 背景颜色
 */
function init(p5, w, h, bg) {
  _p5 = p5;
  _w = w;
  _h = h;

  // TODO 需要定义一些图层方面的配置项
  _p5.createCanvas(w, h);
  _bg = bg || constants.DEFAULT_BACKGROUND;
  _p5.background(..._bg);

  // 订阅相关事件
  eb.subscribe("redraw", (e) => {
    _p5.redraw();
  });

  // 安装舞台编辑模式
  _installStageEditMode();
}

function draw() {
  // 总是将坐标原点移到正中心
  _p5.translate(_w / 2, _h / 2);
  _p5.background(..._bg);
  _p5.rectMode(_p5.CENTER);

  let ctx = _p5.drawingContext;

  _pileOrder.forEach((sid) => {
    let s = _scenes[sid];
    if (!s.hidden) {
      /**
       * 如果场景是被选中的，则绘制图层阴影
       *
       * p5.js不提供相关的api，只能用原生的canvas api进行绘制，
       * 但是这里有个问题：我都用原生的了，干嘛还用p5.js
       */
      if (s.selected) {
        ctx.shadowColor = "#B5B5B5";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillRect(s.x - s.width / 2, s.y - s.height / 2, s.width, s.height);
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        _p5.noFill();
        _p5.stroke(130, 130, 130);
        _p5.rect(s.x, s.y, s.width, s.height);
      }

      s.draw();
      _p5.image(
        s.canvas,
        s.x - s.width / 2,
        s.y - s.height / 2,
        s.width,
        s.height
      );
    }
  });

  // 重置ctx的相关参数，不然会影响后续的绘制
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * 正在创建场景
 *
 * @param {*} w
 * @param {*} h
 */
function creatingScene(w, h) {}

/**
 * 创建场景
 *
 * @param {*} x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 */
function createScene(x, y, w, h) {
  let canvas = _p5.createGraphics(w, h);
  let scene = new Scene(_scenes.length, canvas, x, y, w, h);
  _scenes.push(scene);
  _pileOrder.push(scene.sid);
  eb.publish("redraw", {});
}

/**
 * 复制场景
 *
 * @param {*} sid 场景编号
 */
function copyScene(sid) {
  let scene = _scenes[sid];
  let canvas = _p5.createGraphics(scene.width, scene.height);
  let newScene = scene.copy(_scenes.length, canvas);
  _scenes.push(newScene);
  selectScene(newScene.sid);
}

/**
 * 选中指定的场景
 *
 * 选中的场景会被前置，因此在绘制过程中，需要放到最后绘制
 *
 * @param {Array} sids
 */
function selectScene(...sids) {
  sids.forEach((sid) => {
    /**
     * 改变场景的堆叠顺序
     *
     * 舞台中场景比较少，该操作应该不怎么影响性能
     */
    let index = _pileOrder.indexOf(sid);
    _pileOrder.splice(index, 1);
    _pileOrder.push(sid);

    _scenes[sid].select();
  });
  eb.publish("redraw", {});
  eb.publish("selected", { sids: sids });
}

/**
 * 取消选中指定的场景
 *
 * @param  {...any} sids
 */
function unselectScene(...sids) {
  sids.forEach((sid) => _scenes[sid].unselect());
  eb.publish("redraw", {});
}

/**
 * 缩放场景
 *
 * @param {*} sid
 * @param {*} dw
 * @param {*} dh
 */
function scaleScene(sid, dw, dh) {
  let scene = _scenes[sid];
  scene.scale(dw, dh);
  eb.publish("redraw", {});
}

/**
 * 移动场景
 *
 * @param {*} sid
 * @param {*} v 移动
 */
function moveScene(sid, v) {
  let scene = _scenes[sid];
  scene.move(v);
  eb.publish("redraw", {});
}

/**
 * 隐藏场景
 *
 * @param {*} sid
 */
function hideScene(sid) {
  let scene = _scenes[sid];
  scene.hide();
  unselectScene(sid);
  eb.publish("redraw", {});
}

/**
 * 显示场景
 *
 * @param {*} sid
 */
function showScene(sid) {
  let scene = _scenes[sid];
  scene.show();
  selectScene(sid);
  eb.publish("redraw", {});
}

/**
 * 删除场景
 *
 * @param {*} sid
 */
function deleteScene(sid) {
  _scenes.splice(sid, 1);
  let index = _pileOrder.indexOf(sid);
  _pileOrder.splice(index, 1);
  eb.publish("redraw", {});
}

/**
 * 全屏指定的场景
 *
 * @param {*} sid
 */
function fullScreenScene(sid) {
  let scene = _scenes[sid];
  scene.scale(_w, _h);
  selectScene(sid);
  eb.publish("redraw", {});
}

/*********************************** 以下仅为调试用 ***********************************/
function scenes() {
  return _scenes;
}

function pileOrder() {
  return _pileOrder;
}

export {
  init,
  draw,
  creatingScene,
  createScene,
  copyScene,
  selectScene,
  unselectScene,
  scaleScene,
  moveScene,
  hideScene,
  showScene,
  deleteScene,
  fullScreenScene,
  scenes,
  pileOrder,
};
