import Mobj from "@/lib/Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Vector extends Mobj {
  constructor(s, e, ...rest) {
    super(...rest);
    this.s = s;
    this.e = e;
  }

  show() {
    let [canvas] = arguments;
    let s = this.s;
    let e = this.e;
    canvas.noFill();
    canvas.stroke(255);
    canvas.line(...this.coord.toNativeCoord(s), ...this.coord.toNativeCoord(e));
    let se = e.sub(s);
    let angle = ($math.pi / 6) * 5;
    let lc = e.add(se.mul($math.complex({ r: 0.2 / se.abs(), phi: angle })));
    let rc = e.add(se.mul($math.complex({ r: 0.2 / se.abs(), phi: -angle })));
    canvas.fill(255);
    canvas.noStroke();
    canvas.beginShape();
    canvas.vertex(...this.coord.toNativeCoord(e));
    canvas.vertex(...this.coord.toNativeCoord(lc));
    canvas.vertex(...this.coord.toNativeCoord(rc));
    canvas.endShape(canvas.CLOSE);
    this._done = true;
  }
}

export default Vector;
