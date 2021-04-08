import Mobj from "./Mobj";
const $math = require("mathjs");

class Polyline extends Mobj {
  constructor(vertexes, ..._) {
    super(..._);
    this._vertexes = vertexes;

    this._length = 0;
    for (let i = 0; i < this._vertexes.length - 1; i++) {
      let edge = this._vertexes[i + 1].add(this._vertexes[i].neg());
      this._length = this._length + edge.abs();
    }
  }

  create(canvas, env) {
    this._configCanvas(canvas);
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((x) => x);
    let currentLength = canvas.map(easing(progress), 0, 1, 0, this._length);

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

  fadeOut(canvas, env) {
    let progress = this._getProgress(env.getDurationState());
    let easing = this._aconfig.easing || ((x) => x);
    this._configCanvas(canvas);
    let stroke = this._p5config.stroke;
    let alphaMax = stroke[3];
    let alpha = canvas.map(easing(progress), 0, 1, alphaMax, 0);

    canvas.stroke(...this._p5config.stroke.slice(0, 3), alpha);
    canvas.beginShape();
    this._vertexes.forEach((v) => {
      canvas.vertex(...this.toNativeCoord(v));
    });
    canvas.endShape();
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this.create, 0)
      .withDuration(this._aconfig.duration)
      .submit();
  }
}

export default Polyline;
