import { multiply } from "mathjs";
import Transformation from "./Transformation";

class Translation extends Transformation {
  constructor(dv, mobj, ..._) {
    super(..._);
    this._dv = dv;
    this._mobj = mobj;
  }

  _default(canvas, env, done) {
    canvas.push();
    let mobj = this._mobj;
    this._configCanvas(canvas);
    canvas.translate(...this.toNativeCoord(this._dv));
    done(mobj.show(canvas));
    canvas.pop();
  }

  _slide(canvas, env, done) {
    canvas.push();
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    canvas.translate(
      ...this.toNativeCoord(multiply(this._dv, easing(progress)))
    );
    this._mobj.show(canvas);

    canvas.pop();
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this._default, 0).submit();
  }

  slide() {
    this._submit = () => {
      return this._execNode(this._slide, 0)
        .withDuration(this._aconfig.duration)
        .submit();
    };
    return this;
  }
}

export default Translation;
