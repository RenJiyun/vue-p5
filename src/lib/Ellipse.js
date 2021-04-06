import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");
import Line from "./Line";

class Ellipse extends Mobj {
  constructor(coord, a, b) {
    super(coord);
    this.a = a;
    this.b = b;
  }

  show(canvas) {
    canvas.noFill();
    canvas.stroke(255);
    let delta = 0.1;
    canvas.beginShape();
    for (let theta = 0; theta <= $math.pi * 2 + delta; theta += delta) {
      canvas.vertex(
        ...this.coord.toSceneCoord(
          this.a * $math.cos(theta),
          this.b * $math.sin(theta)
        )
      );
    }

    canvas.endShape();

    this._done = true;
  }

  collide(c, v) {
    let x = c.re;
    let y = c.im;
    let a = this.a;
    let b = this.b;
    let pow = Math.pow;
    let diff = pow(x, 2) / pow(a, 2) + pow(y, 2) / pow(b, 2) - 1;
    if (diff >= 0.1 || diff <= -0.1) {
      console.log(diff);
      return [false, v];
    }

    let line = new Line(
      this.coord,
      $math.complex(pow(a, 2) / x, 0),
      $math.complex(0, pow(b, 2) / y)
    );
    return line.collide(c, v);
  }
}

export default Ellipse;
