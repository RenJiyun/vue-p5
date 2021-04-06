import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Partical extends Mobj {
  constructor(s, v, ...rest) {
    super(...rest);
    this.p = s;
    this.v = v;
    this.trace = [];
    this.trace.push(this.p);
  }

  // show() {
  //   let [canvas, t, deltaTime] = arguments;
  //   canvas.fill(255, 0, 0);
  //   canvas.noStroke();
  //   this.p = this.p.add($math.multiply(this.v, deltaTime / 1000));
  //   let [collided, newV] = this.ellipse.collide(this.p, this.v);
  //   this.v = newV;
  //   if (collided) {
  //     this.current = 0;
  //   }
  //   canvas.circle(
  //     ...this.coord.toNativeCoord(this.p),
  //     this.coord.toSceneLength(0.5)
  //   );
  // }

  show() {
    let [canvas, t, deltaTime] = arguments;
    canvas.noStroke();
    this.p = this.p.add($math.multiply(this.v, deltaTime / 1000));

    this.v = this.vf ? this.vf.f(this.p, t) : this.v;
    this.trace.push(this.p);
    if (this.trace.length >= 10) {
      this.trace.shift();
    }

    for (let i = 0; i < this.trace.length; i++) {
      let r = canvas.map(i, 0, this.trace.length - 1, 0.01, 0.2);
      let t = canvas.map(i, 0, this.trace.length - 1, 10, 255);
      canvas.fill(0, 0, 255, t);
      canvas.circle(
        ...this.coord.toNativeCoord(this.trace[i]),
        this.coord.toSceneLength(r)
      );
    }
  }

  addToVf(vf) {
    this.vf = vf;
  }
}

export default Partical;
