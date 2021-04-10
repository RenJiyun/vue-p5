import SceneObj from "./SceneObj";
import Translation from "./Translation";
import Rotation from "./Rotation";
import Alpha from "./Alpha";
import { complex } from "mathjs";

class Mobj extends SceneObj {
  constructor() {
    super(...arguments);
  }

  stroke() {
    this._p5config.stroke = arguments;
    return this;
  }

  translate(dv, duration, easing) {
    if (dv instanceof Array) {
      dv = complex(...dv);
    }
    return new Translation(dv, this, this._econfig).slide(duration, easing);
  }

  rotate(theta, duration, easing) {
    return new Rotation(theta, this, this._econfig).rotate(duration, easing);
  }

  fadeOut(duration, easing) {
    return new Alpha(this).fadeOut(duration, easing);
  }

  fadeIn(duration, easing) {
    return new Alpha(this).fadeIn(duration, easing);
  }

  create(duration) {
    if (this._create != undefined && typeof this._create == "function") {
      return this._create(duration);
    }
  }
}
export default Mobj;
