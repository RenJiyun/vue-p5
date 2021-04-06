import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Polyline extends Mobj {
  constructor() {
    let [vertexes, p5config, aconfig, ...rest] = arguments;
    super(...rest);
    this.vertexes = vertexes;
    this.p5config = p5config;
    this.aconfig = aconfig;

    this.length = 0;
    for (let i = 0; i < this.vertexes.length - 1; i++) {
      let edge = this.vertexes[i + 1].add(this.vertexes[i].neg());
      this.length = this.length + edge.abs();
    }
  }

  draw() {
    let duration = this.aconfig.duration;
    let easing = this.aconfig.easing || ((x) => x);
    let [canvas, lt] = arguments;
    if (!this.p5config.fill) {
      canvas.noFill();
    }
    canvas.stroke(...this.p5config.stroke);
    canvas.strokeWeight(this.p5config.strokeWeight);
    canvas.strokeJoin(canvas.ROUND);

    lt = Math.min(lt, duration);

    let progress = lt / duration;
    let currentLength =
      canvas.map(lt, 0, duration, 0, this.length) * easing(progress);

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
      return;
    } else {
      return {
        fn: this.draw,
        layer: 0,
      };
    }
  }

  layerNum() {
    return 1;
  }

  enter() {
    return {
      fn: this.draw,
      layer: 0,
    };
  }
}

export default Polyline;
