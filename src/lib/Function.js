import Mobj from "./Mobj";

class Function extends Mobj {
  constructor(f, ..._) {
    super(..._);
    this._f = f;
  }

  _create(canvas, env) {
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

  _draw(canvas, env, done) {
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

  create() {
    this._submit = () => {
      return this._execNode(this._create, 0)
        .withDuration(this._aconfig.duration)
        .submit();
    };
    return this;
  }

  draw() {
    this._submit = () => {
      return this._execNode(this._draw, 0).submit();
    };
    return this;
  }

  _submit() {
    throw new Error("pick an animation");
  }
}

export default Function;
