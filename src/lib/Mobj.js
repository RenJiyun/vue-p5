/**
 * 数学对象均需要关联特定的坐标系，并且坐标由复数表示
 */
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Mobj {
  constructor(coord) {
    this.coord = coord;
    this.coord.add(this);
    this._done = false;
    this.current = 0;
  }

  coordChanged() {
    this._done = false;
  }

  get done() {
    return this._done;
  }
}

class Circle extends Mobj {
  constructor(coord, c0, r) {
    super(coord);
    this.c0 = c0;
    this.r = r;
  }

  show(canvas) {
    canvas.noFill();
    canvas.stroke(255);
    canvas.beginShape();
    let delta = 0.05;
    for (let angle = 0; angle <= $math.pi * 2 + delta; angle += delta) {
      let { x, y } = this.coord.toSceneCoord(
        this.c0.add($math.complex({ r: this.r, phi: angle }))
      );
      canvas.vertex(x, y);
    }
    canvas.endShape();
    this._done = true;
  }

  create(canvas, progress) {
    canvas.noFill();
    canvas.stroke(255);
    canvas.beginShape();
    let delta = 0.05;
    for (
      let angle = 0;
      angle <= ($math.pi * 2 + delta) * progress;
      angle += delta
    ) {
      let { x, y } = this.coord.toSceneCoord(
        this.c0.add($math.complex({ r: this.r, phi: angle }))
      );
      canvas.vertex(x, y);
    }
    canvas.endShape();

    if (progress >= 1) {
      this._done = true;
    }
  }
}

class Function extends Mobj {
  constructor(coord, f) {
    super(coord);
    this.f = f;

    this.duration = 1000;
    this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  show(canvas, deltaTime) {
    this.current += deltaTime;

    let progress = Math.min(this.current / this.duration, 1);
    if (progress >= 1) {
      this._done = true;
    }
    let delta = 0.05;
    canvas.noFill();
    canvas.stroke(255);
    canvas.beginShape();

    let xMax =
      this.coord.xMin +
      (this.coord.xMax + delta - this.coord.xMin) * this.easing(progress);
    for (let x = this.coord.xMin; x <= xMax; x += delta) {
      canvas.vertex(...this.coord.toSceneCoord(x, this.f(x)));
    }
    canvas.endShape();
  }
}

export { Mobj, Circle, Function };
