import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");
import Vector from "./Vector";

class VetorField extends Mobj {
  constructor(f, ...rest) {
    super(...rest);
    this.f = f;
  }

  show() {
    let [canvas, t] = arguments;
    canvas.noFill();
    canvas.stroke(255);
    let delta = this.config.delta || 1.5;
    for (let x = this.coord.xMin; x <= this.coord.xMax; x += delta) {
      for (let y = this.coord.yMin; y <= this.coord.yMax; y += delta) {
        let c = $math.complex(x, y);
        let fc = this.f(c, t);
        let ec = c.add(fc);

        new Vector(c, ec, { coord: this.coord }).show(canvas);
      }
    }

    this.done = true;
  }

  add(vf) {
    return new VetorField(
      (c, t) => {
        let v1 = this.f(c, t);
        let v2 = vf.f(c, t);
        return v1.add(v2);
      },
      {
        coord: this.coord,
      }
    );
  }
}

export default VetorField;
