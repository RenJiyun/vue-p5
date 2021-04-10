const $math = require("mathjs");
import Mobj from "./Mobj";

class Coord extends Mobj {
  constructor(config, ..._) {
    super(..._);
    let {
      ox,
      oy,
      width,
      height,
      xInterval,
      yInterval,
      grid,
      label,
      labelInterval,
      display,
    } = config;
    this._ox = ox;
    this._oy = oy;
    this._width = width;
    this._height = height;
    this._xInterval = xInterval;
    this._yInterval = yInterval ? yInterval : xInterval;
    this._grid = grid == undefined ? true : grid;
    this._xMax = this._width / this._xInterval / 2;
    this._xMin = -this._xMax;
    this._yMax = this._height / this._yInterval / 2;
    this._yMin = -this._yMax;
    this._label = label;
    this._labelInterval = labelInterval == undefined ? 1 : labelInterval;
    this._scale = 1;
    this._display = display == undefined ? true : display;
  }

  get xMin() {
    return this._xMin;
  }

  get xMax() {
    return this._xMax;
  }

  toNativeCoord() {
    if (arguments.length == 1) {
      let c = arguments[0];
      return [
        this._ox + c.re * this._xInterval,
        this._oy - c.im * this._yInterval,
      ];
    } else if (arguments.length == 2) {
      return [
        this._ox + arguments[0] * this._xInterval,
        this._oy - arguments[1] * this._yInterval,
      ];
    }
  }

  toNativeLength(l) {
    // 这里要求xInterval == yInterval
    return l * this._xInterval;
  }

  // x-axis
  _create_0(canvas, env, done) {
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);

    canvas.stroke(255);
    canvas.fill(255);
    let hl = this._width / 2;
    let l = canvas.map(easing(progress), 0, 1, 0, hl);
    canvas.line(this._ox - l, this._oy, this._ox + l, this._oy);
  }

  // y-axis
  _create_1(canvas, env, done) {
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    canvas.stroke(255);
    canvas.fill(255);
    let hl = this._height / 2;
    let l = canvas.map(easing(progress), 0, 1, 0, hl);
    canvas.line(this._ox, this._oy - l, this._ox, this._oy + l);
  }

  // grid
  _create_2(canvas, env, done) {
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((_) => _);
    canvas.stroke(255, 100);
    canvas.fill(255);
    let hw = (this._width / 2) * easing(progress);
    let hh = (this._height / 2) * easing(progress);
    for (let x = 0, i = 0; x <= hw; x += this._xInterval, i++) {
      if (this._grid) {
        canvas.line(this._ox + x, this._oy - hh, this._ox + x, this._oy + hh);
        canvas.line(this._ox - x, this._oy - hh, this._ox - x, this._oy + hh);
      }

      if (i % this._labelInterval == 0) {
        if (this._label) {
          canvas.text(i, this._ox + x + 5, this._oy + 15);
          canvas.text(-i, this._ox - x + 5, this._oy + 15);
        }

        canvas.circle(this._ox + x, this._oy, 5);
        canvas.circle(this._ox - x, this._oy, 5);
      }
    }

    hw = (this._width / 2) * easing(progress);
    hh = (this._height / 2) * easing(progress);
    for (let y = 0, i = 0; y <= hh; y += this._yInterval, i++) {
      if (this._grid) {
        canvas.line(this._ox - hw, this._oy + y, this._ox + hw, this._oy + y);
        canvas.line(this._ox - hw, this._oy - y, this._ox + hw, this._oy - y);
      }

      if (i != 0 && i % this._labelInterval == 0) {
        if (this._label) {
          canvas.text(i, this._ox - 15, this._oy - y - 5);
          canvas.text(-i, this._ox - 20, this._oy + y - 5);
        }

        canvas.circle(this._ox, this._oy - y, 5);
        canvas.circle(this._ox, this._oy + y, 5);
      }
    }
  }

  _draw(canvas, env, done) {
    if (!this._display) {
      done(true);
      return;
    }

    canvas.stroke(255);
    canvas.fill(255);

    // x-axis
    canvas.line(
      this._ox - this._width / 2,
      this._oy,
      this._ox + this._width / 2,
      this._oy
    );
    // y-axis
    canvas.line(
      this._ox,
      this._oy - this._height / 2,
      this._ox,
      this._oy + this._height / 2
    );

    canvas.stroke(255, 100);
    for (let x = 0, i = 0; x <= this._width / 2; x += this._xInterval, i++) {
      if (this._grid) {
        canvas.line(
          this._ox + x,
          this._oy - this._height / 2,
          this._ox + x,
          this._oy + this._height / 2
        );
        canvas.line(
          this._ox - x,
          this._oy - this._height / 2,
          this._ox - x,
          this._oy + this._height / 2
        );
      }

      if (i % this._labelInterval == 0) {
        if (this._label) {
          canvas.text(i, this._ox + x + 5, this._oy + 15);
          canvas.text(-i, this._ox - x + 5, this._oy + 15);
        }

        canvas.circle(this._ox + x, this._oy, 5);
        canvas.circle(this._ox - x, this._oy, 5);
      }
    }

    for (let y = 0, i = 0; y <= this._height / 2; y += this._yInterval, i++) {
      if (this._grid) {
        canvas.line(
          this._ox - this._width / 2,
          this._oy + y,
          this._ox + this._width / 2,
          this._oy + y
        );
        canvas.line(
          this._ox - this._width / 2,
          this._oy - y,
          this._ox + this._width / 2,
          this._oy - y
        );
      }

      if (i != 0 && i % this._labelInterval == 0) {
        if (this._label) {
          canvas.text(i, this._ox - 15, this._oy - y - 5);
          canvas.text(-i, this._ox - 20, this._oy + y - 5);
        }

        canvas.circle(this._ox, this._oy - y, 5);
        canvas.circle(this._ox, this._oy + y, 5);
      }
    }
    done(true);
  }


  default() {
    this._layerNum = 1;
    this._submit = () => {
      return this._execNode(this._draw, 0).submit();
    };
    return this;
  }

  create() {
    if (!this._display) {
      return this.default();
    }
    this._layerNum = 3;
    this._submit = () => {
      return this._sequence(
        this._execNode(this._create_0, 0).withDuration(500),
        this._execNode(this._create_1, 1).withDuration(500),
        this._execNode(this._create_2, 2).withDuration(500)
      ).submit();
    };

    return this;
  }
}

export default Coord;
