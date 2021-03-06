const $math = require("mathjs");
import Animation from "./Animation";
class Alpha extends Animation {
  constructor(mobj) {
    super({}, {}, mobj._econfig);
    this._mobj = mobj;
    this._fillAlpha = mobj._p5config.fill ? mobj._p5config.fill[3] : undefined;
    this._strokeAlpha = mobj._p5config.stroke
      ? mobj._p5config.stroke[3]
      : undefined;
  }

  _default(canvas, env, done) {
    done(this._mobj.show(canvas));
  }

  _gradient(fn) {
    return (canvas, env, done) => {
      let progress = this._getProgress(env.getDurationState());
      let mobj = this._mobj;
      let fillAlphaMax = this._fillAlpha || 0;
      let strokeAlphaMax = this._strokeAlpha || 0;
      let fillAlpha = fn(0, fillAlphaMax)(progress);
      let strokeAlpha = fn(0, strokeAlphaMax)(progress);

      if (this._fillAlpha) {
        this._mobj._p5config.fill[3] = fillAlpha;
      }
      if (this._strokeAlpha) {
        this._mobj._p5config.stroke[3] = strokeAlpha;
      }
      mobj.show(canvas);

      if (this._fillAlpha) {
        this._mobj._p5config.fill[3] = this._fillAlpha;
      }
      if (this._strokeAlpha) {
        this._mobj._p5config.stroke[3] = this._strokeAlpha;
      }

      if (progress >= 1 && !mobj.done) {
        // 等待mobj结束
        done(false);
        return;
      } else if (progress >= 1 && mobj.done) {
        return;
      }
      mobj._reset();
    };
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this._default, 0).submit();
  }

  fadeOut(duration, easing = (_) => _) {
    let fn = (min, max) => {
      return (process) => {
        return this.map(easing(process), 1, 0, min, max);
      };
    };
    return this.gradient(fn, duration);
  }

  fadeIn(duration, easing = (_) => _) {
    let fn = (min, max) => {
      return (process) => {
        return this.map(easing(process), 0, 1, min, max);
      };
    };
    return this.gradient(fn, duration);
  }

  breathe(duration) {
    let fn = (min, max) => {
      return (process) => {
        return this.map($math.sin($math.pi * 2 * process), -1, 1, min, max);
      };
    };
    return this.gradient(fn, duration);
  }

  blink(f, duration) {
    let fn = (min, max) => {
      return (process) => {
        if (process >= 1) {
          return max;
        }
        return this.map(
          $math.sin($math.pi / 2 + $math.pi * 2 * process * f),
          -1,
          1,
          min,
          max
        );
      };
    };
    return this.gradient(fn, duration);
  }

  gradient(fn, duration) {
    this._es = this._execNode(this._gradient(fn), 0).withDuration(
      duration || 500
    );
    this._submit = () => {
      return this._es.submit();
    };
    return this;
  }

  _s(alpha) {
    this._submit = () => {
      return this._sequence(this._es, alpha._es).submit();
    };
    return this;
  }

  _p(alpha) {
    this._submit = () => {
      return this._parallel(this._es, alpha._es).submit();
    };
    return this;
  }
}

export default Alpha;
