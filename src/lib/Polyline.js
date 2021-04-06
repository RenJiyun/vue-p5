import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Polyline extends Mobj {
  constructor() {
    let [vertexes, ...rest] = arguments;
    super(...rest);
    this.vertexes = vertexes;

    this.length = 0;
    for (let i = 0; i < this.vertexes.length - 1; i++) {
      let edge = this.vertexes[i + 1].add(this.vertexes[i].neg());
      this.length = this.length + edge.abs();
    }

    this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  draw() {
    let duration = 1000;
    let [canvas, lt] = arguments;
    canvas.noFill();
    canvas.stroke(0, 255, 0, 100);
    canvas.strokeJoin(canvas.ROUND);
    canvas.strokeWeight(20);

    lt = Math.min(lt, duration);

    let progress = lt / duration;
    let currentLength =
      canvas.map(lt, 0, duration, 0, this.length) * this.easing(progress);

    canvas.beginShape();
    for (let i = 0; i < this.vertexes.length - 1; i++) {
      let sv = this.vertexes[i];
      let ev = this.vertexes[i + 1];
      canvas.vertex(...this.coord.toNativeCoord(sv));
      let edge = ev.sub(sv);
      if (currentLength > edge.abs()) {
        currentLength -= edge.abs();
        continue;
      } else {
        let ratio = currentLength / edge.abs();
        let cc = sv.add($math.multiply(edge, ratio));
        canvas.vertex(...this.coord.toNativeCoord(cc));
        break;
      }
    }
    canvas.endShape();

    if (lt >= duration) {
      this.next();
    }
  }

  states() {
    return [this.draw];
  }
}

export default Polyline;
