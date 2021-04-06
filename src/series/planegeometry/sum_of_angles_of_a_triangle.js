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
    let [canvas, lt] = arguments;
    let duration = 600;
    let easing = $bazier(1, 0.08, 0.85, 0.09);

    if (this.state == 0) {
      canvas.noFill();
      canvas.stroke(255);

      lt = Math.min(lt, duration);

      if (lt >= duration) {
        this.next();
      }

      let progress = lt / duration;
      let currentLength =
        canvas.map(lt, 0, duration, 0, this.length) * easing(progress);

      canvas.beginShape();
      for (let i = 0; i < this.vertexes.length - 1; i++) {
        let sv = this.vertexes[i];
        let ev = this.vertexes[i + 1];
        canvas.vertex(...this.coord.toNativeCoord(sv));
        let edge = ev.sub(sv);
        if (currentLength > edge.abs()) {
          currentLength -= edge.abs();
          // TODO 精度问题：剩余的currentLength有可能比最后一条边长还大，此时continue会使得循环退出，从而最后一条边消失
          continue;
        } else {
          let ratio = currentLength / edge.abs();
          let cc = sv.add($math.multiply(edge, ratio));
          canvas.vertex(...this.coord.toNativeCoord(cc));
          break;
        }
      }

      // 用于修复上述的精度问题
      if (this.state != 0) {
        canvas.vertex(...this.coord.toNativeCoord(this.vertexes[0]));
      }
      canvas.endShape();
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

    this.next();
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
      this.next();
    }
  }

  // 演示B的内错角
  highlightAngleB() {
    let [canvas, lt, t, deltaTime, nativeCanvas] = arguments;
    let polyline = this.polyline;
    if (polyline == undefined) {
      polyline = new Polyline([this.v1, this.A, this.B, this.C], {
        coord: this.coord,
      });
      let innerCanvas = nativeCanvas.createGraphics(
        canvas.width,
        canvas.height
      );
      innerCanvas.background(0, 0, 0, 0);
      innerCanvas.translate(canvas.width / 2, canvas.height / 2);
      polyline.layers = [innerCanvas];
      this.polyline = polyline;
    }
    polyline.show(canvas, t, deltaTime);
    if (polyline.done) {
      this.next();
    }

    // TODO高亮显示后如何渐出？ 生成器是不是可以解决这个问题
  }

  // 演示C的内错角
  highlightAngleC() {
    this.next();
  }

  showTheFlatAngle() {
    this.next();
  }

  states() {
    return [
      this.create,
      this.markTheAngles,
      this.drawTheParallelOfBC,
      this.highlightAngleB,
      this.highlightAngleC,
      this.showTheFlatAngle,
    ];
  }
}

export { SumOfAnglesOfATriangle };
