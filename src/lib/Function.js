import Mobj from "./Mobj";

class Function extends Mobj {
  constructor(f, econfig) {
    super({ fill: false }, {}, econfig);
    this._f = f;
  }

  _create_0(canvas, env) {
    this._configCanvas(canvas);
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    let delta = 0.1;
    canvas.beginShape();
    let xMax =
      this.xrange[0] +
      (this.xrange[1] + delta - this.xrange[0]) * easing(progress);
    for (let x = this.xrange[0]; x <= xMax; x += delta) {
      canvas.vertex(...this.toNativeCoord(x, this._f(x)));
    }
    canvas.endShape();
  }

  _default(canvas, env, done) {
    this._configCanvas(canvas);
    let delta = 0.1;
    canvas.beginShape();
    let xMax = this.xrange[0] + (this.xrange[1] + delta - this.xrange[0]);
    for (let x = this.xrange[0]; x <= xMax; x += delta) {
      canvas.vertex(...this.toNativeCoord(x, this._f(x)));
    }
    canvas.endShape();
    done(true);
  }

  get _layerNum() {
    return 1;
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

  _submit() {
    return this._execNode(this._default, 0).submit();
  }
}

export default Function;
