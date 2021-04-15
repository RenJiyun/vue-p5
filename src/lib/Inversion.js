import { complex, pow } from "mathjs";
import Transformation from "./Transformation";

class Inversion extends Transformation {
  constructor(O, r, mobj, econfig) {
    super({fill: false}, {}, econfig);
    this._O = O;
    this._r = r;
    this._mobj = mobj;
  }

  _default(canvas, env, done) {
    this._configCanvas(canvas);
    let vertexes = this._mobj.sampling();
    canvas.beginShape();
    vertexes.forEach((v) => {
      canvas.vertex(...this.toNativeCoord(this._f(v)));
    });
    canvas.endShape();
    done(true);
  }

  _f(v) {
    let OP = v.sub(this._O);
    let OP1 = complex({ r: pow(this._r, 2) / OP.abs(), phi: OP.arg() });
    let P1 = this._O.add(OP1);
    return P1;
  }

  get _layerNum() {
    return 1;
  }

  _execPlan() {
    return this._execNode(this._default, 0);
  }
}

export default Inversion;
