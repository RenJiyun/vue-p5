import Transformation from "./Transformation";

class Rotation extends Transformation {
  constructor(theta, mobj, econfig) {
    super({}, {}, econfig);
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
    canvas.rotate(this.toNativeAngle(this._theta * easing(progress)));
    done(this._mobj.show(canvas));
    canvas.pop();
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this._default, 0).submit();
  }

  rotate(duration, easing) {
    this._aconfig.easing = easing;
    this._submit = () => {
      return this._execNode(this._rotate, 0)
        .withDuration(duration)
        .submit();
    };
    return this;
  }
}

export default Rotation;
