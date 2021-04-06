import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Line extends Mobj {
  constructor(coord, c0, c1) {
    super(coord);
    this.c0 = c0;
    this.c1 = c1;

    this.duration = 1000;
    this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  show(canvas, deltaTime) {
    let c0 = this.c0;
    let c1 = this.c1;
    canvas.noFill();
    canvas.stroke(255);

    this.current += deltaTime;
    let progress = Math.min(this.current / this.duration, 1);

    if (!this._done) {
      let c0c1 = c1.sub(c0);
      let m = $math.multiply(c0.add(c1), 0.5);
      let hd = c1.sub(c0).abs() / 2;
      let hl = hd * this.easing(progress);
      let lc = m.add($math.complex({ r: -hl, phi: c0c1.arg() }));
      let rc = m.add($math.complex({ r: hl, phi: c0c1.arg() }));
      canvas.line(
        ...this.coord.toSceneCoord(lc),
        ...this.coord.toSceneCoord(rc)
      );
    }

    if (progress >= 1) {
      this._done = true;
    }
  }

  collide(c, v) {
    let c0 = this.c0;
    let c1 = this.c1;
    let c0c1 = c1.sub(c0);
    let c0c = c.sub(c0);
    let angle = c0c.arg() - c0c1.arg();
    if (Math.abs(angle) > 0.01) {
      return [false, v];
    }
    let angle_ingoing_c0c1 = v.arg() - c0c1.arg();
    let d_outgoing = c0c1.mul(
      $math.complex({ r: 1, phi: -angle_ingoing_c0c1 })
    );
    return [true, $math.complex({ r: v.abs(), phi: d_outgoing.arg() })];
  }
}

export default Line;
