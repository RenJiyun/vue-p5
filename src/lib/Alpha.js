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

  _default(canvas, env, done) {
    done(this._mobj.show(canvas));
  }

  _fade(flag) {
    return (canvas, env, done) => {
      let progress = this._getProgress(env.getDurationState());
      let easing = this._aconfig.easing || ((_) => _);
      let mobj = env.getMobjState("_fade", () => {
        return this._mobj;
      });
      let fillAlphaMax = this._fillAlpha || 0;
      let strokeAlphaMax = this._strokeAlpha || 0;
      let direction;
      if (flag) {
        direction = [0, 1];
      } else {
        direction = [1, 0];
      }
      let fillAlpha = canvas.map(
        easing(progress),
        ...direction,
        0,
        fillAlphaMax
      );
      let strokeAlpha = canvas.map(
        easing(progress),
        ...direction,
        0,
        strokeAlphaMax
      );

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
    };
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this._default, 0).submit();
  }

  fadeOut() {
    let duration = this._mobj._aconfig.duration || this._aconfig.duration;
    this._submit = () => {
      return this._execNode(this._fade(false), 0)
        .withDuration(duration)
        .submit();
    };
    return this;
  }

  fadeIn() {
    let duration = this._mobj._aconfig.duration || this._aconfig.duration;
    this._submit = () => {
      return this._execNode(this._fade(true), 0)
        .withDuration(duration)
        .submit();
    };
    return this;
  }
}

export default Alpha;
