import SceneObj from "./SceneObj";

let _p5;
let _coord;
let _econfig;

function init(p5, coord) {
  _p5 = p5;
  _coord = coord;

  if (_p5 == undefined) {
    throw Error("p5 is undefined");
  }

  if (_coord == undefined) {
    throw Error("coord is undefined");
  }

  _econfig = {
    p5: _p5,
    coord: _coord,
  };
}


class Mode {
  keyPressed(e, scene) {
    if (e.key == "c" && this._creatingId == undefined) {
      scene.refresh();
    }
  }

  mouseClicked(e, scene) {}

  publishMobj(mobj, scene) {
    scene.add(mobj);
    scene.remove(this._creatingId);
    scene.refresh();
  }
}

function mode() {
  return new Mode();
}

let M_CREATE = new Mode();
export { init, M_CREATE };

/**
 * alt作为模式选择的先导键
 * 目前支持的模式有两种：
 * 1. 移动模式 m
 * 2. 创建模式 c
 *
 * 无论哪种模式，都需要判断当前鼠标是否位于某个对象上，从而在创建后，
 * 可以建立对象之间的关系
 *
 * space作为创建模式下对象选择的先导键
 * 目前可以支持的对象有：
 * 1. 点 p
 * 2. 直线 l
 * 3. 线段 s
 * 4. 圆 c
 * 5. 三角形 t
 * 6. 长方形 r
 * 7. 正方形 sq
 * 8. 多边形 po
 * 10. 平移变换 tr
 * 11. 旋转变换 ro
 * 12. 对称变换 re
 * 13. 反演变换 in
 */

