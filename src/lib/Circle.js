import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

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
      let { x, y } = this.coord.toNativeCoord(
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
      let { x, y } = this.coord.toNativeCoord(
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

export default Circle;
