import Mobj from "@/lib/Mobj";
import Polyline from "@/lib/Polyline";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

// 三角形内角和定理
class SumOfAnglesOfATriangle extends Mobj {
  constructor(A, B, C, ...rest) {
    super(...rest);

    this.A = A;
    this.B = B;
    this.C = C;

    this.vertexes = [A, B, C, A];

    this.length = 0;
    for (let i = 0; i < this.vertexes.length - 1; i++) {
      let edge = this.vertexes[i + 1].add(this.vertexes[i].neg());
      this.length = this.length + edge.abs();
    }

    // 计算角度
    this.aA = Math.abs(B.sub(A).arg() - C.sub(A).arg());
    this.aB = Math.abs(A.sub(B).arg() - C.sub(B).arg());
    this.aC = Math.abs(B.sub(C).arg() - A.sub(C).arg());
  }

  create() {
    let [canvas, lt, t, deltaTime, nativeCanvas] = arguments;
    if (this._create_polyline_ == undefined) {
      this._create_polyline_ = new Polyline(
        [this.A, this.B, this.C, this.A],
        { strokeWeight: 3, stroke: [255, 255, 255], fill: false },
        { duration: 500 },
        {
          coord: this.coord,
        }
      );
      let innerCanvas = nativeCanvas.createGraphics(
        canvas.width,
        canvas.height
      );
      innerCanvas.background(0, 0, 0, 0);
      innerCanvas.translate(canvas.width / 2, canvas.height / 2);
      this._create_polyline_.layers = [innerCanvas];
    }
    this._create_polyline_.show(canvas, t, deltaTime);

    if (this._create_polyline_.done) {
      return {
        fn: this.markTheAngles,
        layer: 1,
      };
    } else {
      return {
        fn: this.create,
        layer: 0,
      };
    }
  }

  // 标记角度
  markTheAngles() {
    function mark(canvas, v, c0, c1, r) {
      canvas.noFill();
      canvas.stroke(255);
      canvas.beginShape();
      canvas.vertex(...this.coord.toNativeCoord(v));

      for (let k = 0; k <= 1; k += 0.1) {
        let m = v.add(
          $math.complex({ r: r, phi: c0.arg() * k + c1.arg() * (1 - k) })
        );
        canvas.vertex(...this.coord.toNativeCoord(m));
      }
      canvas.vertex(...this.coord.toNativeCoord(v));
      canvas.endShape();
    }

    let [canvas, lt] = arguments;
    let [A, B, C] = [this.A, this.B, this.C];

    let AB = B.sub(A);
    let AC = C.sub(A);

    let BA = A.sub(B);
    let BC = C.sub(B);

    let CA = A.sub(C);
    let CB = B.sub(C);

    mark.bind(this)(canvas, A, AB, AC, 1.5);
    mark.bind(this)(canvas, B, BA, BC, 1.5);
    mark.bind(this)(canvas, C, CA, CB, 1.5);

    return {
      fn: this.drawTheParallelOfBC,
      layer: 2,
    };
  }

  drawTheParallelOfBC() {
    let [canvas, lt] = arguments;
    let [A, B, C] = [this.A, this.B, this.C];
    let BC = C.sub(B);
    let duration = 500;
    let progress = lt / duration;
    if (progress >= 1) progress = 1;

    let easing = $bazier(1, 0.08, 0.85, 0.09);

    let v0 = A.add($math.multiply(BC, easing(progress)));
    let v1 = A.add($math.multiply(BC, -easing(progress)));

    canvas.noFill();
    canvas.stroke(255);
    canvas.line(
      ...this.coord.toNativeCoord(v0),
      ...this.coord.toNativeCoord(v1)
    );

    // 仅供后续阶段使用
    this.v0 = v0;
    this.v1 = v1;

    if (progress >= 1) {
      return {
        fn: this.highlightAngleB,
        layer: 3,
      };
    } else {
      return {
        fn: this.drawTheParallelOfBC,
        layer: 2,
      };
    }
  }

  // 演示B的内错角
  highlightAngleB() {
    let [canvas, lt, t, deltaTime, nativeCanvas] = arguments;
    if (this._highlightAngleB_polyline_ == undefined) {
      this._highlightAngleB_polyline_ = new Polyline(
        [this.v1, this.A, this.B, this.C],
        { fill: false, strokeWeight: 10, stroke: [0, 255, 0, 100] },
        { duration: 500, easing: $bazier(1, 0.08, 0.85, 0.09) },
        {
          coord: this.coord,
        }
      );
      let innerCanvas = nativeCanvas.createGraphics(
        canvas.width,
        canvas.height
      );
      innerCanvas.background(0, 0, 0, 0);
      innerCanvas.translate(canvas.width / 2, canvas.height / 2);
      this._highlightAngleB_polyline_.layers = [innerCanvas];
    }
    this._highlightAngleB_polyline_.show(canvas, t, deltaTime);
    if (this._highlightAngleB_polyline_.done) {
      return {
        fn: this.highlightAngleC,
        layer: 4,
      };
    } else {
      return {
        fn: this.highlightAngleB,
        layer: 3,
      };
    }
  }

  // 演示C的内错角
  highlightAngleC() {
    let [canvas, lt, t, deltaTime, nativeCanvas] = arguments;
    if (this._highlightAngleC_polyline_ == undefined) {
      this._highlightAngleC_polyline_ = new Polyline(
        [this.v0, this.A, this.C, this.B],
        { fill: false, strokeWeight: 10, stroke: [255, 0, 0, 100] },
        { duration: 500, easing: $bazier(1, 0.08, 0.85, 0.09) },
        {
          coord: this.coord,
        }
      );
      let innerCanvas = nativeCanvas.createGraphics(
        canvas.width,
        canvas.height
      );
      innerCanvas.background(0, 0, 0, 0);
      innerCanvas.translate(canvas.width / 2, canvas.height / 2);
      this._highlightAngleC_polyline_.layers = [innerCanvas];
    }
    this._highlightAngleC_polyline_.show(canvas, t, deltaTime);
    if (this._highlightAngleC_polyline_.done) {
      return {
        fn: this.showTheFlatAngle,
        layer: 5,
      };
    } else {
      return {
        fn: this.highlightAngleC,
        layer: 4,
      };
    }
  }

  showTheFlatAngle() {
      return;
  }

  // 返回需要的图层数量
  layerNum() {
    return 6;
  }

  enter() {
    return {
      fn: this.create,
      layer: 0,
    };
  }
}

export { SumOfAnglesOfATriangle };
