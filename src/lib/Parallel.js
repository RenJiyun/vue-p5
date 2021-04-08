import Mobj from "./Mobj";
const $math = require("mathjs");

class Parallel extends Mobj {
  constructor(pc, dc, ..._) {
    super(..._);
    this._pc = pc;
    this._dc = dc;
  }

  _create(canvas, env) {
    let progress = this._getProgress(env.getDurationState());
    this._configCanvas(canvas);
    let easing = this._aconfig.easing || ((_) => _);
    let scale = 1;
    if (this._dc.abs() < 10) {
      scale = 2;
    }
    let v0 = this._pc.add($math.multiply(this._dc, easing(progress) * scale));
    let v1 = this._pc.add($math.multiply(this._dc, -easing(progress) * scale));
    canvas.line(...this.toNativeCoord(v0), ...this.toNativeCoord(v1));
  }

  _draw(canvas, env, done) {
    this._configCanvas(canvas);
    let scale = 1;
    if (this._dc.abs() < 10) {
      scale = 2;
    }
    let v0 = this._pc.add($math.multiply(this._dc, scale));
    let v1 = this._pc.add($math.multiply(this._dc, -scale));
    canvas.line(...this.toNativeCoord(v0), ...this.toNativeCoord(v1));
    done(true);
  }

  get _layerNum() {
    return 1;
  }

  create() {
    return this._execNode(this._create, 0)
      .withDuration(this._aconfig.duration)
      .submit();
  }

  draw() {
    this._submit = () => {
      return this._execNode(this._draw, 0)
        .withDuration(this._aconfig.duration)
        .submit();
    };
    return this;
  }

  _submit() {
    return this.create();
  }
}

export default Parallel;
