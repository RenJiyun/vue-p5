import Mobj from "./Mobj";
const $math = require("mathjs");

class Arc extends Mobj {
  constructor(O, r, as, ae, ..._) {
    super(..._);
    this._O = O;
    this._r = r;
    this._as = as;
    this._ae = ae;

    while (this._as > this._ae) {
      this._as -= $math.pi * 2;
    }

    this._cs = $math.complex({ r: r, phi: as });
    this._ce = $math.complex({ r: r, phi: ae });
  }

  create(canvas, env, done) {
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    this._configCanvas(canvas);
    let delta = 0.02;
    canvas.beginShape();
    canvas.vertex(...this.toNativeCoord(this._O));
    let angleLimit = this._as + (this._ae - this._as) * easing(progress);
    for (let angle = this._as; angle <= angleLimit + delta; angle += delta) {
      angle = Math.min(angle, this._ae);
      canvas.vertex(
        ...this.toNativeCoord(
          this._O.add($math.complex({ r: this._r, phi: angle }))
        )
      );
      if (angle >= this._ae) {
        break;
      }
    }
    canvas.vertex(...this.toNativeCoord(this._O));
    canvas.endShape();
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this.create, 0)
      .withDuration(this._aconfig.duration)
      .submit();
  }
}

export default Arc;
