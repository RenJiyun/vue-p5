import Mobj from "../Mobj";

class Aobj extends Mobj {
  constructor(p5, coord) {
    super({}, {}, { p5: p5, coord: coord });
    console.log(this)
  }

  get _layerNum() {
    return 1;
  }

  _submit() {
    return this._execNode(this.draw, 0).withDuration(1000000).submit();
  }
}

export default Aobj;
