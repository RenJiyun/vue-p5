import { abs, cos, divide, log, max, min, multiply, pow, sin, sqrt, tan } from "mathjs";
import Aobj from "./Aobj";
const $math = require("mathjs");

class Wave extends Aobj {
  constructor() {
    super(...arguments);
  }

  draw(canvas, env) {
    let { lt } = env.getDurationState();
    canvas.noStroke();
    canvas.fill(255);
    let width = 40;
    let height = 30;
    let delta = 0.4;
    for (let x = 0; x <= width / 2; x += delta) {
      for (let y = 0; y <= height / 2; y += delta) {
        let d = sqrt(pow(x, 2) + pow(y, 2));
        let c1 = $math.complex(x, y).mul(
          $math.complex({
            r:
              canvas.map(
                sin(lt / 500 + ($math.pi * d) / 10),
                -1,
                1,
                d - 0.3,
                d + 1
              ) / d,
            phi: 0,
          })
        );
        let c2 = $math
          .complex(x, y)
          .mul($math.complex({ r: 1, phi: lt/10000 }));
        let c = sin(c2).add(sin(c2).mul(sin(c2)));
        let x0 = c.re;
        let y0 = c.im;
        canvas.circle(...this.toNativeCoord(x0, y0), this.toNativeLength(0.12));
        canvas.circle(
          ...this.toNativeCoord(-x0, y0),
          this.toNativeLength(0.12)
        );
        canvas.circle(
          ...this.toNativeCoord(-x0, -y0),
          this.toNativeLength(0.12)
        );
        canvas.circle(
          ...this.toNativeCoord(x0, -y0),
          this.toNativeLength(0.12)
        );
      }
    }
  }
}

export default Wave;
