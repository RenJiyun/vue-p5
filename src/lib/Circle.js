import Mobj from "./Mobj";
const $math = require("mathjs");

class Circle extends Mobj {
  constructor(c0, r, ..._) {
    super(..._);
    this._c0 = c0;
    this._r = r;
  }

  draw(canvas, env) {
    let easing = this._aconfig.easing || ((x) => x);
    this._configCanvas(canvas);
    let progress = this._getProgress(env.getDurationState());

    canvas.beginShape();
    let delta = 0.05;
    for (
      let angle = 0;
      angle <= ($math.pi * 2 + delta) * easing(progress);
      angle += delta
    ) {
      let { x, y } = this.toNativeCoord(
        this.c0.add($math.complex({ r: this.r, phi: angle }))
      );
      canvas.vertex(x, y);
    }
    canvas.endShape();
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

export default Circle;
