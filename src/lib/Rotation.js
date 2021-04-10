import Transformation from "./Transformation";

class Rotation extends Transformation {
  constructor(theta, mobj, ..._) {
    super(..._);
    this._theta = theta;
    this._mobj = mobj;
  }

  _default(canvas, env, done) {
    canvas.push();
    let mobj = this._mobj;
    this._configCanvas(canvas);
    canvas.rotate(this._theta);
    done(mobj.show(canvas));
    canvas.pop();
  }

  _rotate(canvas, env, done) {
    canvas.push();
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    canvas.rotate(-this._theta * easing(progress));
    this._mobj.show(canvas);

    canvas.pop();
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this._default, 0).submit();
  }

  rotate() {
    this._submit = () => {
      return this._execNode(this._rotate, 0)
        .withDuration(this._aconfig.duration)
        .submit();
    };
    return this;
  }
}

export default Rotation;
