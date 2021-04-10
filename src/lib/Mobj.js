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

  strokeWeight() {
    this._p5config.strokeWeight = arguments[0];
    return this;
  }

  _translate(dv, duration, easing, parallel) {
    if (dv instanceof Array) {
      dv = complex(...dv);
    }
    return new Translation(dv, this, this._econfig).slide(
      duration,
      easing,
      parallel
    );
  }

  translate() {
    return this._translate(...arguments, true);
  }

  translate_() {
    return this._translate(...arguments, false);
  }

  _rotate(theta, duration, easing, parallel) {
    return new Rotation(theta, this, this._econfig).rotate(
      duration,
      easing,
      parallel
    );
  }

  rotate(theta, duration, easing) {
    return this._rotate(theta, duration, easing, true);
  }

  rotate_(theta, duration, easing) {
    return this._rotate(theta, duration, easing, false);
  }

  fadeOut(duration, easing) {
    return new Alpha(this).fadeOut(duration, easing);
  }

  fadeIn(duration, easing) {
    return new Alpha(this).fadeIn(duration, easing);
  }

  create(duration, easing) {
    if (this._create != undefined && typeof this._create == "function") {
      return this._create(duration, easing);
    }
  }
}

export default Mobj;
