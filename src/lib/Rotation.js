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

  _id(canvas, env, done) {
    done(this._mobj.show(canvas));
  }

  _rotate(canvas, env, done) {
    canvas.push();
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    canvas.rotate(this.toNativeAngle(this._theta * easing(progress)));
    this._mobj.show(canvas);
    if (progress >= 1 && !this._mobj.done) {
      done(false);
      canvas.pop();
      return;
    } else if (progress >= 1 && this._mobj.done) {
      canvas.pop();
      return;
    }
    this._mobj._reset();
    canvas.pop();
  }

  get _layerNum() {
    return 1;
  }

  rotate(duration, easing, parallel) {
    this._aconfig.easing = easing;
    if (parallel) {
      this._execPlan = () => {
        return this._execNode(this._rotate, 0).withDuration(duration || 500);
      };
    } else {
      this._execPlan = () => {
        return this._sequence(
          this._execNode(this._id, 0),
          this._execNode(this._rotate, 0).withDuration(duration || 500)
        );
      };
    }

    return this;
  }

  _execPlan() {
    return this._execNode(this._default, 0);
  }
}

export default Rotation;
