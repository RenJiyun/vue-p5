import * as mm from "./mode_manager";
import constants from "./constants";

class Scene {
  constructor(sid, canvas, x, y, w, h) {
    this._sid = sid;
    this._canvas = canvas;
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;

    // 指示场景是否被选中
    this._selected = false;

    // 指示场景是否隐藏
    this._hidden = false;
  }

  get sid() {
    return this._sid;
  }

  get canvas() {
    return this._canvas;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get width() {
    return this._w;
  }

  get height() {
    return this._h;
  }

  get selected() {
    return this._selected;
  }

  get hidden() {
    return this._hidden;
  }

  copy(sid, canvas) {}

  select() {
    this._selected = true;
  }

  unselect() {
    this._selected = false;
  }

  hide() {
    this._hidden = true;
  }

  show() {
    this._hidden = false;
  }

  scale(dw, dh) {
    this._x += dw / 2;
    this._y += dh / 2;
    this._w += dw;
    this._h += dh;
  }

  move(v) {
    this._x += v[0];
    this._y += v[1];
  }

  draw() {
    let canvas = this._canvas;

    // 做一些重置工作
    canvas.clear();
    canvas.rectMode(canvas.CENTER);
    // 对于p5.Graphics对象需要重置变换矩阵，否则变换会被累积
    canvas.resetMatrix();
    canvas.translate(this._w / 2, this._h / 2);

    // TODO 需要设置一些图层相关的配置项
    canvas.background(constants.DEFAULT_BACKGROUND);
  }
}

export default Scene;
