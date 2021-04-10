import { cos, max, min, pow, sin, sqrt } from "mathjs";
import Aobj from "./Aobj";
const $math = require("mathjs");

class Partical extends Aobj {
  constructor() {
    super(...arguments);
  }

  draw(canvas, env) {
    let { lt } = env.getDurationState();
    canvas.noStroke();
    canvas.fill(255);
  }
}

export default Partical;
