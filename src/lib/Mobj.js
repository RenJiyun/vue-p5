const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Mobj {
  constructor() {
    let [config] = arguments;
    this.config = config;
    this.coord = config.coord;

    this.done = false;
    this._layers = [];
    this.state = null;

    this.initialized = false;

    // 每个状态有自己的局部时间线
    this.stateTimelines = {};
  }

  set layers(layers) {
    this._layers = layers;
  }

  get layers() {
    return this._layers;
  }

  init() {
    this.state = this.enter();
    this.initialized = true;
  }

  show() {
    if (!this.initialized) {
      this.init();
    }

    let [outCanvas, t, deltaTime, ...rest] = arguments;

    // 合成内部图层
    for (let i = 0; i < this.layers.length; i++) {
      outCanvas.image(
        this.layers[i],
        -outCanvas.width / 2,
        -outCanvas.height / 2,
        outCanvas.width,
        outCanvas.height
      );
    }

    if (this.state == undefined) {
      this.done = true;
      return;
    }

    let timeline = this.stateTimelines[this.state.fn.name] || 0;

    this.stateTimelines[this.state.fn.name] = timeline + deltaTime;
    let innerCanvas = this.layers[this.state.layer];
    innerCanvas.clear();
    innerCanvas.noFill();
    innerCanvas.stroke(255);
    innerCanvas.strokeWeight(3);
    this.state = this.state.fn.bind(this)(
      innerCanvas,
      timeline,
      t,
      deltaTime,
      ...rest
    );
  }
}

export default Mobj;
