import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Function extends Mobj {
  constructor(coord, f, config) {
    super(coord);
    this.f = f;
    this.config = config || {};
    // this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  show() {
    let [canvas, t] = arguments;
    let progress = Math.min(t / (this.config.duration || 1000), 1);

    progress = this.config.easing ? this.config.easing(progress) : progress;
    let delta = this.config.delta || 0.1;

    canvas.noFill();
    canvas.stroke(255);
    canvas.beginShape();
    let xMax =
      this.coord.xMin + (this.coord.xMax + delta - this.coord.xMin) * progress;
    for (let x = this.coord.xMin; x <= xMax; x += delta) {
      canvas.vertex(...this.coord.toNativeCoord(x, this.f(x)));
    }
    canvas.endShape();
  }
}

export default Function;
