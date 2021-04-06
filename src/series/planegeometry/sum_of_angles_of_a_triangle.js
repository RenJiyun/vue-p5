const { Mobj } = require("../../lib/Mobj");
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
  }

  create() {
    let [canvas, lt] = arguments;
    let duration = 2000;
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

  markTheAngles() {
    this.next();
  }

  drawTheParallelOfBC() {
    this.next();
  }

  highlightAngleB() {
    this.next();
  }

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
