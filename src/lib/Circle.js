import Mobj from "./Mobj";
const $math = require("mathjs");

class Circle extends Mobj {
  constructor(O, r, econfig) {
    super({ fill: false }, {}, econfig);
    this._O = O;
    this._r = r;
  }

  _create_0(canvas, env) {
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
      canvas.vertex(
        ...this.toNativeCoord(
          this._O.add($math.complex({ r: this._r, phi: angle }))
        )
      );
    }
    canvas.endShape();
  }

  _default(canvas, env, done) {
    this._configCanvas(canvas);
    canvas.circle(
      ...this.toNativeCoord(this._O),
      2 * this.toNativeLength(this._r)
    );
    done(true);
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execPlan().submit();
  }

  _create(duration, easing) {
    this._aconfig.easing = easing;
    this._submit = () => {
      return this._execNode(this._create_0, 0)
        .withDuration(duration || 500)
        .submit();
    };

    return this;
  }

  _execPlan() {
    return this._execNode(this._default, 0);
  }
}

export default Circle;
