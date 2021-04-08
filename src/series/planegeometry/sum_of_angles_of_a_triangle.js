const $math = require("mathjs");
const $bazier = require("bezier-easing");
import Mobj from "@/lib/Mobj";
import Polyline from "@/lib/Polyline";
import Angle from "@/lib/Angle";
import Parallel from "@/lib/Parallel";

// 三角形内角和定理
class SumOfAnglesOfATriangle extends Mobj {
  constructor(A, B, C, econfig) {
    super({}, {}, econfig);
    this.A = A;
    this.B = B;
    this.C = C;
  }

  create(canvas, env, done) {
    let { duration } = env.getDurationState();
    let polyline = env.getMobjState("create", () => {
      return new Polyline(
        [this.A, this.B, this.C, this.A],
        { fill: false, strokeWeight: 3, stroke: [255, 255, 255] },
        { duration: duration, easing: $bazier(1, 0.08, 0.85, 0.09) },
        this._econfig
      );
    });
    done(polyline.show(canvas));
  }

  _markAngle(name, A, O, B) {
    return (canvas, env, done) => {
      let { duration } = env.getDurationState();
      let angle = env.getMobjState(name, () => {
        return new Angle(
          A,
          O,
          B,
          name,
          { fill: [0, 0, 255, 100], strokeWeight: 2, stroke: false },
          { duration: duration, easing: $bazier(1, 0.08, 0.85, 0.09) },
          this._econfig
        );
      });
      done(angle.show(canvas));
    };
  }
  drawTheParallelOfBC(canvas, env, done) {
    let parallel = env.getMobjState("drawTheParallelOfBC", () => {
      return new Parallel(
        this.A,
        this.B.sub(this.C),
        { fill: false, strokeWeight: 3, stroke: [255] },
        { duration: 300, easing: $bazier(1, 0.08, 0.85, 0.09) },
        this._econfig
      );
    });

    done(parallel.show(canvas));
  }

  _createZ(name, points) {
    return (canvas, env, done) => {
      let polyline = env.getMobjState(name, () => {
        return new Polyline(
          points,
          { fill: false, strokeWeight: 10, stroke: [0, 255, 0, 100] },
          { duration: 1000, easing: $bazier(1, 0.08, 0.85, 0.09) },
          this._econfig
        );
      });
      done(polyline.show(canvas));
    };
  }

  createZB(canvas, env, done) {
    let v = this.A.add(this.B.sub(this.C));
    this._createZ("createZB", [v, this.A, this.B, this.C])(canvas, env, done);
  }

  createZC(canvas, env, done) {
    let v = this.A.add(this.C.sub(this.B));
    this._createZ("createZC", [v, this.A, this.C, this.B])(canvas, env, done);
  }

  _fadeZ(name, points) {
    return (canvas, env, done) => {
      let polyline = env.getMobjState(name, () => {
        let p = new Polyline(
          points,
          { fill: false, strokeWeight: 10, stroke: [0, 255, 0, 100] },
          { duration: 1000, easing: $bazier(1, 0.08, 0.85, 0.09) },
          this._econfig
        );
        return this.animate(p, "fadeOut");
      });
      done(polyline.show(canvas));
    };
  }

  fadeZB(canvas, env, done) {
    let v = this.A.add(this.B.sub(this.C));
    this._fadeZ("fadeZB", [v, this.A, this.B, this.C])(canvas, env, done);
  }

  fadeZC(canvas, env, done) {
    let v = this.A.add(this.C.sub(this.B));
    this._fadeZ("fadeZC", [v, this.A, this.C, this.B])(canvas, env, done);
  }

  showTheFlatAngle(canvas, env) {}

  get _layerNum() {
    return 9;
  }

  _submit() {
    return this._sequence(
      this._execNode(this.create, 1).withDuration(500),
      this._execNode(
        this._markAngle("λ", this.B, this.A, this.C),
        2
      ).withDuration(100),
      this._execNode(
        this._markAngle("β", this.C, this.B, this.A),
        3
      ).withDuration(100),
      this._execNode(
        this._markAngle("γ", this.A, this.C, this.B),
        4
      ).withDuration(100),
      this._execNode(this.drawTheParallelOfBC, 5).withDuration(500),
      this._execNode(this.createZB, 6).withDuration(500),
      this._execNode(this.fadeZB, 6).withDuration(600),
      this._execNode(this.createZC, 7).withDuration(500),
      this._execNode(this.fadeZC, 7).withDuration(600),
      this._execNode(this.showTheFlatAngle, 8).withDuration(500)
    ).submit();
  }
}

export { SumOfAnglesOfATriangle };
