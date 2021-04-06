const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Mobj {
  constructor() {
    let [config] = arguments;
    this.config = config;
    this.coord = config.coord;

    this.done = false;
    this._layers = [];
    this.state = 0;

    this.initialized = false;

    // 每个状态有自己的局部时间线
    this.stateTimelines = [];
  }

  set layers(layers) {
    this._layers = layers;
  }

  get layers() {
    return this._layers;
  }

  init() {
    // 初始化状态的时间线
    this.states().forEach(() => {
      this.stateTimelines.push(0);
    });
    this.initialized = true;
  }

  next() {
    this.state++;
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

    let timeline = this.stateTimelines[this.state];

    timeline += deltaTime;
    this.stateTimelines[this.state] = timeline;
    if (this.state == this.states().length) {
      this.done = true;
      return;
    }
    let sf = this.states()[this.state];
    let innerCanvas = this.layers[this.state];
    // 初始化内部图层的基本参数
    innerCanvas.clear();
    innerCanvas.noFill();
    innerCanvas.stroke(255);
    innerCanvas.strokeWeight(3);
    sf.bind(this)(innerCanvas, timeline, t, deltaTime, ...rest);
  }
}

export default Mobj;
