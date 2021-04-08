import Mobj from "./Mobj";

class Alpha extends Mobj {
  constructor(mobj, aconfig) {
    super({}, aconfig, mobj._econfig);
    this._mobj = mobj;
    this._fillAlpha = mobj._p5config.fill ? mobj._p5config.fill[3] : undefined;
    this._strokeAlpha = mobj._p5config.stroke
      ? mobj._p5config.stroke[3]
      : undefined;
  }

  _fadeOut(canvas, env, done) {
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    let mobj = env.getMobjState("_fadeOut", () => {
      return this._mobj;
    });
    let fillAlphaMax = this._fillAlpha || 0;
    let strokeAlphaMax = this._strokeAlpha || 0;
    let fillAlpha = canvas.map(easing(progress), 0, 1, fillAlphaMax, 0);
    let strokeAlpha = canvas.map(easing(progress), 0, 1, strokeAlphaMax, 0);

    if (this._fillAlpha) {
      this._mobj._p5config.fill[3] = fillAlpha;
    }
    if (this._strokeAlpha) {
      this._mobj._p5config.stroke[3] = strokeAlpha;
    }
    mobj.show(canvas);
    if (!mobj._aconfig.duration) {
        mobj._reset();
    }
  }

  _fadeIn(canvas, env, done) {

  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this.fadeOut();
  }

  fadeOut() {
    let duration = this._mobj._aconfig.duration || this._aconfig.duration;
    return this._execNode(this._fadeOut, 0)
      .withDuration(duration)
      .submit();
  }
}

export default Alpha;
