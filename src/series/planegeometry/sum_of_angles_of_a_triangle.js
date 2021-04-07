import Mobj from "@/lib/Mobj";
import Polyline from "@/lib/Polyline";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

// 三角形内角和定理
class SumOfAnglesOfATriangle extends Mobj {
  constructor(A, B, C, econfig) {
    super(econfig);
    this.A = A;
    this.B = B;
    this.C = C;
  }

  create(canvas, env, done) {
    let polyline = env.getMobjState("create", () => {
      return new Polyline(
        [this.A, this.B, this.C, this.A],
        { fill: false, strokeWeight: 3, stroke: [255, 255, 255] },
        { duration: 2000, easing: $bazier(1, 0.08, 0.85, 0.09) },
        this._econfig
      );
    });
    done(polyline.show(canvas));
  }

  markTheAngles(canvas, env, done) {
    function mark(canvas, v, c0, c1, r) {
      canvas.noFill();
      canvas.stroke(255);
      canvas.beginShape();
      canvas.vertex(...this.toNativeCoord(v));

      for (let k = 0; k <= 1; k += 0.1) {
        let m = v.add(
          $math.complex({ r: r, phi: c0.arg() * k + c1.arg() * (1 - k) })
        );
        canvas.vertex(...this.toNativeCoord(m));
      }
      canvas.vertex(...this.toNativeCoord(v));
      canvas.endShape();
    }
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
    done(true);
  }

  drawTheParallelOfBC(canvas, env) {
    let { lt, duration } = env.getDurationState();
    let [A, B, C] = [this.A, this.B, this.C];
    let BC = C.sub(B);
    let progress = lt / duration;
    let easing = $bazier(1, 0.08, 0.85, 0.09);
    let v0 = A.add($math.multiply(BC, easing(progress)));
    let v1 = A.add($math.multiply(BC, -easing(progress)));
    canvas.noFill();
    canvas.stroke(255);
    canvas.line(...this.toNativeCoord(v0), ...this.toNativeCoord(v1));
    this.v0 = v0;
    this.v1 = v1;
  }

  highlightAngleB(canvas, env, done) {
    let polyline = env.getMobjState("highlightAngleB", () => {
      return new Polyline(
        [this.v1, this.A, this.B, this.C],
        { fill: false, strokeWeight: 10, stroke: [0, 255, 0, 100] },
        { duration: 500, easing: $bazier(1, 0.08, 0.85, 0.09) },
        this._econfig
      );
    });
    done(polyline.show(canvas));
  }

  // 演示C的内错角
  highlightAngleC(canvas, env, done) {
    let polyline = env.getMobjState("highlightAngleC", () => {
      return new Polyline(
        [this.v0, this.A, this.C, this.B],
        { fill: false, strokeWeight: 10, stroke: [255, 0, 0, 100] },
        { duration: 500, easing: $bazier(1, 0.08, 0.85, 0.09) },
        this._econfig
      );
    });
    done(polyline.show(canvas));
  }

  showTheFlatAngle(canvas, env) {}

  get _layerNum() {
    return 5;
  }

  _submit() {
    return this._sequence(
      this._parallel(
        this._execNode(this.create, 0).withDuration(1000),
        this._execNode(this.markTheAngles, 1),
        this._execNode(this.drawTheParallelOfBC, 2).withDuration(1000)
      ),
      this._parallel(
        this._execNode(this.highlightAngleB, 3).withDuration(500),
        this._execNode(this.highlightAngleC, 3).withDuration(500)
      ),
      this._execNode(this.showTheFlatAngle, 4).withDuration(500)
    ).submit();
  }
}

export { SumOfAnglesOfATriangle };
