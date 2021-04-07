import Mobj from "./Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Polyline extends Mobj {
  constructor() {
    let [vertexes, p5config, aconfig, econfig] = arguments;
    super(econfig);
    this._vertexes = vertexes;
    this._p5config = p5config;
    this._aconfig = aconfig;

    this._length = 0;
    for (let i = 0; i < this._vertexes.length - 1; i++) {
      let edge = this._vertexes[i + 1].add(this._vertexes[i].neg());
      this._length = this._length + edge.abs();
    }
  }

  draw(canvas, env) {
    let { lt, duration } = env.getDurationState();
    let easing = this._aconfig.easing || ((x) => x);

    if (!this._p5config.fill) {
      canvas.noFill();
    }
    canvas.stroke(...this._p5config.stroke);
    canvas.strokeWeight(this._p5config.strokeWeight);
    canvas.strokeJoin(canvas.ROUND);

    lt = Math.min(lt, duration);

    let progress = lt / duration;
    let currentLength =
      canvas.map(lt, 0, duration, 0, this._length) * easing(progress);

    canvas.beginShape();
    for (let i = 0; i < this._vertexes.length - 1; i++) {
      let sv = this._vertexes[i];
      let ev = this._vertexes[i + 1];
      canvas.vertex(...this.toNativeCoord(sv));
      let edge = ev.sub(sv);
      if (currentLength > edge.abs()) {
        currentLength -= edge.abs();
        continue;
      } else {
        let ratio = currentLength / edge.abs();
        let cc = sv.add($math.multiply(edge, ratio));
        canvas.vertex(...this.toNativeCoord(cc));
        break;
      }
    }
    canvas.endShape();
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this.draw, 0).withDuration(this._aconfig.duration).submit();
  }
}

export default Polyline;
