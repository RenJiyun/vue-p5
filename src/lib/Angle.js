import Mobj from "./Mobj";
const $math = require("mathjs");
import Arc from "./Arc";

// 有向角，逆时针为正
class Angle extends Mobj {
  constructor(A, O, B, name, ..._) {
    super(..._);
    this._A = A;
    this._O = O;
    this._B = B;
    this._name = name;

    this._OA = A.sub(O);
    this._OB = B.sub(O);
  }

  _create_0(canvas, env, done) {
    let arc = env.getMobjState("create", () => {
      return new Arc(
        this._O,
        2,
        this._OA.arg(),
        this._OB.arg(),
        this._p5config,
        this._aconfig,
        this._econfig
      );
    });
    done(arc.show(canvas));
  }

  _create_1(canvas, env, done) {
    let dc = $math.multiply(this._OA, 0.5).add($math.multiply(this._OB, 0.5));
    let p = this._O.add($math.complex({ r: 4, phi: dc.arg() }));
    canvas.textSize(30);
    canvas.fill(255);
    canvas.text(this._name, ...this.toNativeCoord(p));
    done(true);
  }

  get _layerNum() {
    return 2;
  }

  _submit() {
    return this.create();
  }

  create() {
    return this._parallel(
      this._execNode(this._create_0, 0),
      this._execNode(this._create_1, 1)
    ).submit();
  }
}

export default Angle;
