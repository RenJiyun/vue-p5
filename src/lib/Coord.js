const $math = require("mathjs");

class Coord {
  constructor(config) {
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

    this._done = false;
  }

  get done() {
    return this._done;
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

  show(canvas) {
    if (!this._display) {
      this._done = true;
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
    this._done = true;
  }
}

export default Coord;
