import { add, distance, divide } from "mathjs";

class MathObject {
  constructor() {
    this._id = nextId(this);
  }

  /**
   * 所有数学对象带有该唯一标识，并以此构建依赖图
   */
  get id() {
    return this._id;
  }

  /**
   * 获取采样点
   * @returns Array
   */
  points() {
    return [];
  }

  /**
   * 指定的位置是否位于该对象上
   * @param {*} coord
   * @returns
   */
  incidence(coord) {
    return false;
  }

  /**
   * 沿着指定方向移动图形
   * @param {*} v
   */
  move(v) {}

  /**
   * 移动依赖点
   * @param {Point} p
   * @returns {Array}
   */
  moveDependentPoint(p) {
    return [0, 0];
  }

  /**
   * 依赖更新后，自身做相应的更新
   */
  dependencyUpdated() {}

  /**
   * 将点的移动限制在该对象上
   * @param {*} coord
   * @param {*} v
   */
  constrainedMove(coord, v) {}

  /**
   * 声明依赖
   * @param  {...MathObject} dependencies
   */
  dependOn(...dependencies) {}
}

/**
 * 自由点
 */
class Point extends MathObject {
  constructor(coord) {
    super();
    this._coord = coord;
  }

  points() {
    return [this._coord];
  }

  incidence(coord) {
    if (distance(this._coord, coord) <= 0.001) {
      return true;
    } else {
      return false;
    }
  }

  move(v) {
    this._coord = add(this._coord, v);
    updateDependents([this]);
  }
}

/**
 * 线上的点
 */
class On extends Point {
  constructor(coord, l) {
    super(coord);
    this._l = l;
    this.dependOn(l);
  }

  move(v) {
    // 将移动限制在线上，调整移动向量，然后再更新
    v = this._l.constrainedMove(this._coord, v);
    this._coord = add(this._coord, v);
    updateDependents([this]);
  }

  dependencyUpdated() {
    let v = this._l.moveDependentPoint(this);
    this._coord = add(this._coord, v);
  }
}

/**
 * 交点
 */
class Intersection extends Point {
  constructor(coord, l1, l2) {
    super(coord);
    this._l1 = l1;
    this._l2 = l2;
    this.dependOn(l1, l2);
  }

  move() {
    // 交点不能移动
  }

  dependencyUpdated() {
    this._coord = intercetion(this._coord, this._l1, this._l2);
  }
}

/**
 * 中点
 */
class Mid extends Point {
  constructor(p1, p2) {
    let m = divide(add(p1._coord, p2._coord), 2);
    super(m);
    this._p1 = p1;
    this._p2 = p2;
    this.dependOn(p1, p2);
  }

  move() {
    // 中点不能移动
  }

  dependencyUpdated() {
    let m = divide(add(this._p1._coord, this._p2._coord), 2);
    this._coord = m;
  }
}

/**
 * 线段
 */
class Segment extends MathObject {
  constructor(p1, p2) {
    super();
    this._p1 = p1;
    this._p2 = p2;
    this._coord1 = this._p1._coord;
    this._coord2 = this._p2._coord;
    this.dependOn(p1, p2);
  }

  points() {
    return [this._coord1, this._coord2];
  }

  move(v) {
    move([this._p1, this._p2], v);
    updateDependents([this._p1, this._p2]);
  }

  incidence(p) {
    // TODO
  }

  dependencyUpdated() {
    this._coord1 = this._p1._coord;
    this._coord2 = this._p2._coord;
  }

  constrainedMove(coord, v) {
    // TODO
  }

  moveDependentPoint(p) {
    if (p instanceof On) {
      // TODO 按比例分配
    } else {
      throw new Error();
    }
  }

  get length() {
    return distance(this._coord1, this._coord2);
  }
}

/**
 * 射线
 */
class Ray extends MathObject {
  constructor(p, v) {
    super();
    this._p = p;
    this._v = v;
    this.dependOn(p, v);
  }

  incidence(coord) {}

  points() {}

  move(v) {
    this._p.move(v);
  }

  dependencyUpdated() {}
}

/**
 * 直线
 */
class Line extends MathObject {
  constructor(p1, p2) {
    super();
    this._p1 = p1;
    this._p2 = p2;

    this.dependOn(p1, p2);
  }

  points() {}

  incidence(coord) {}

  move(v) {
    move([this._p1, this._p2], v);
    updateDependents([this._p1, this._p2]);
  }

  dependencyUpdated() {}
}

/**
 * 垂线
 */
class Perpendicular extends MathObject {
  constructor(p, l) {
    super();
    this._p = p;
    this._l = l;
    this.dependOn(p, l);
  }

  points() {}

  move(v) {
    this._p.move(v);
  }

  dependencyUpdated() {}

  moveDependentPoint(p) {}
}

/**
 * 平行线
 */
class Parallel extends MathObject {
  constructor(p, l) {
    super();
    this._p = p;
    this._l = l;
    this.dependOn(p, l);
  }

  points() {}

  move(v) {
    this._p.move(v);
  }

  dependencyUpdated() {}

  moveDependentPoint(p) {}
}

/**
 * 切线
 */
class Tangent extends MathObject {
  constructor(p, l) {
    super();
    this._p = p;
    this._l = l;
    this.dependOn(p, l);
  }

  points() {}

  move(v) {
    // 切分无法移动
  }

  dependencyUpdated() {}

  moveDependentPoint(p) {}
}

/**
 * 由圆心和圆周上一点确定的圆
 */
class Circle0 extends MathObject {
  constructor(p1, p2) {
    super();
    this._p1 = p1;
    this._p2 = p2;
    this._coord1 = this._p1._coord;
    this._coord2 = this._p2._coord;
    this.dependOn(p1, p2);
  }

  points() {}

  move(v) {
    move([this._p1, this._p2], v);
    updateDependents([this._p1, this._p2]);
  }

  dependencyUpdated() {
    this._coord1 = this._p1._coord;
    this._coord2 = this._p2._coord;
  }

  moveDependentPoint(p) {}
}

/**
 * 由圆心和线段确定的圆：该线段长度即为圆的半径
 */
class Circle1 extends MathObject {
  constructor(p, l) {
    if (!(l instanceof Segment)) {
      throw new Error();
    }
    super();
    this._p = p;
    this._l = l;
    this._coord = this._p._coord;
    this._r = this._l.length;
    this.dependOn(p, l);
  }

  points() {}

  move(v) {
    this._p.move(v);
  }

  dependencyUpdated() {
    this._coord = this._p._coord;
    this._r = this._l.length;
  }

  moveDependentPoint(p) {}
}

/**
 * 由圆心和半径确定的圆
 */
class Circle2 extends MathObject {
  constructor(p, r) {
    super();
    this.dependOn(p);
  }
}

/**
 * 由圆周上三个点确定的圆
 */
class Circle3 extends MathObject {
  constructor(p1, p2, p3) {
    super();
    this.dependOn(p1, p2, p3);
  }
}

/**
 * 扇形
 */
class Sector extends MathObject {}

/**
 * 多边形
 */
class Polygon extends MathObject {
  constructor(...ps) {
    super();
    this.dependOn(...ps);
  }
}

/**
 * 由两个焦点和椭圆圆周上一点确定的圆
 */
class Ellipse extends MathObject {
  constructor(p1, p2, p3) {
    super();
    this.dependOn(p1, p2, p3);
  }
}

/**
 * 抛物线
 */
class Parabola extends MathObject {}

/**
 * 双曲线
 */
class Hyperbola extends MathObject {}

/**
 * 向量
 */
class Vector extends MathObject {
  constructor(p1, p2) {
    super();
    this.dependOn(p1, p2);
  }
}

/**
 * 角
 */
class Angle extends MathObject {}

/**
 * 平移
 */
class Translation0 extends MathObject {
  constructor(mo, v) {
    super();
    this.dependOn(mo, v);
  }
}

class Rotation0 extends MathObject {
  constructor(mo, a) {
    super();
    this.dependOn(mo, a);
  }
}

class Rotation1 extends MathObject {
  constructor(mo, theta) {
    super();
    this.dependOn(mo);
  }
}

class Reflection0 extends MathObject {
  constructor(mo, l) {
    super();
    this.dependOn(mo, l);
  }
}

class Reflection1 extends MathObject {
  constructor(mo, p) {
    super();
    this.dependOn(mo, p);
  }
}

class Inversion0 extends MathObject {
  constructor(mo, c) {
    super();
    this.dependOn(mo, c);
  }
}

class Dilation extends MathObject {
  constructor(mo, p) {
    super();
    this.dependOn(mo, p);
  }
}

// TODO 还需要加上度量相关的对象，如长度，角度
// TODO 时间需要成为一个数学对象，这样才可以构建动态的数学图形，例如滚动的圆

/**
 * 用广度优先的方式级联更新mo的所有依赖方（直接和间接）
 * @param {Array} mos
 */
function updateDependents(mos) {}

function move(ps, v) {
  // TODO 校验所有的点是否兼容刚性移动，这里的情况可能比较多，不单单是平行线这种
}

function nextId(mo) {
  _mobjs.push(mo);
  return _id++;
}

/**
 * 计算两条线在指定位置附近的交点
 * 采用直接计算法或者牛顿迭代法
 * @param {*} coord
 * @param {*} l1
 * @param {*} l2
 */
function intercetion(coord, l1, l2) {}

var _id = 0;
var _mobjs = [];
