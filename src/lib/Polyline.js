import Mobj from "./Mobj";
const $math = require("mathjs");

class Polyline extends Mobj {
  constructor(vertexes, econfig) {
    super({ fill: false }, {}, econfig);
    this._vertexes = vertexes;

    this._length = 0;
    for (let i = 0; i < this._vertexes.length - 1; i++) {
      let edge = this._vertexes[i + 1].add(this._vertexes[i].neg());
      this._length = this._length + edge.abs();
    }
  }

  _create_0(canvas, env) {
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

  _default(canvas, env, done) {
    this._configCanvas(canvas);
    canvas.beginShape();
    for (let i = 0; i < this._vertexes.length; i++) {
      canvas.vertex(...this.toNativeCoord(this._vertexes[i]));
    }
    canvas.endShape();
    done(true);
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this._default, 0).submit();
  }

  _create(duration) {
    this._submit = () => {
      return this._execNode(this._create_0, 0)
        .withDuration(duration || 500)
        .submit();
    };
    return this;
  }
}

export default Polyline;
