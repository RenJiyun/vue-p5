import Mobj from "./Mobj";
const $math = require("mathjs");

class Line extends Mobj {
  constructor(c0, c1, ..._) {
    super(..._);
    this._c0 = c0;
    this._c1 = c1;
  }

  draw(canvas, env) {
    let { c0, c1 } = [this._c0, this._c1];
    let easing = this._aconfig.easing || ((x) => x);
    this._configCanvas(canvas);
    let progress = this._getProgress(env.getDurationState());

    let c0c1 = c1.sub(c0);
    let m = $math.multiply(c0.add(c1), 0.5);
    let hd = c1.sub(c0).abs() / 2;
    let hl = hd * easing(progress);
    let lc = m.add($math.complex({ r: -hl, phi: c0c1.arg() }));
    let rc = m.add($math.complex({ r: hl, phi: c0c1.arg() }));
    canvas.line(...this.toNativeCoord(lc), ...this.toNativeCoord(rc));
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this.draw, 0)
      .withDuration(this._aconfig.duration)
      .submit();
  }
}

export default Line;
