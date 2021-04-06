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
      display
    } = config;
    this.ox = ox;
    this.oy = oy;
    this.width = width;
    this.height = height;
    this.xInterval = xInterval;
    this.yInterval = yInterval ? yInterval : xInterval;
    this.grid = grid == undefined ? true : grid;
    this.xMax = this.width / this.xInterval / 2;
    this.xMin = -this.xMax;
    this.yMax = this.height / this.yInterval / 2;
    this.yMin = -this.yMax;
    this.label = label;
    this.labelInterval = labelInterval == undefined ? 1 : labelInterval;
    this.scale = 1;
    this.display = display == undefined ? true : display;
    
    this.done = false;
  }

  toNativeCoord() {
    if (arguments.length == 1) {
      let c = arguments[0];
      return [this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval];
    } else if (arguments.length == 2) {
      return [
        this.ox + arguments[0] * this.xInterval,
        this.oy - arguments[1] * this.yInterval,
      ];
    }
  }

  toNativeLength(l) {
    // 这里要求xInterval == yInterval
    return l * this.xInterval;
  }

  applyTransformation(t) {
    
  }

  show() {
    if (!this.display) {
      this.done = true;
      return;
    }
    let [canvas, t, deltaTime] = arguments;
    canvas.stroke(255);
    canvas.fill(255);

    // x-axis
    canvas.line(
      this.ox - this.width / 2,
      this.oy,
      this.ox + this.width / 2,
      this.oy
    );
    // y-axis
    canvas.line(
      this.ox,
      this.oy - this.height / 2,
      this.ox,
      this.oy + this.height / 2
    );

    canvas.stroke(255, 100);
    for (let x = 0, i = 0; x <= this.width / 2; x += this.xInterval, i++) {
      if (this.grid) {
        canvas.line(
          this.ox + x,
          this.oy - this.height / 2,
          this.ox + x,
          this.oy + this.height / 2
        );
        canvas.line(
          this.ox - x,
          this.oy - this.height / 2,
          this.ox - x,
          this.oy + this.height / 2
        );
      }

      if (i % this.labelInterval == 0) {
        if (this.label) {
          canvas.text(i, this.ox + x + 5, this.oy + 15);
          canvas.text(-i, this.ox - x + 5, this.oy + 15);
        }

        canvas.circle(this.ox + x, this.oy, 5);
        canvas.circle(this.ox - x, this.oy, 5);
      }
    }

    for (let y = 0, i = 0; y <= this.height / 2; y += this.yInterval, i++) {
      if (this.grid) {
        canvas.line(
          this.ox - this.width / 2,
          this.oy + y,
          this.ox + this.width / 2,
          this.oy + y
        );
        canvas.line(
          this.ox - this.width / 2,
          this.oy - y,
          this.ox + this.width / 2,
          this.oy - y
        );
      }

      if (i != 0 && i % this.labelInterval == 0) {
        if (this.label) {
          canvas.text(i, this.ox - 15, this.oy - y - 5);
          canvas.text(-i, this.ox - 20, this.oy + y - 5);
        }

        canvas.circle(this.ox, this.oy - y, 5);
        canvas.circle(this.ox, this.oy + y, 5);
      }
    }
    this.done = true;
  }
}

export { Coord };
