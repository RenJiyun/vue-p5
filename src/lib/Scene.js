import Mobj from "./Mobj";

class Scene {
  constructor(config) {
    let { p5, width, height } = config;
    this._p5 = p5;
    this._width = width;
    this._height = height;

    this._p5.createCanvas(this._width, this._height);

    this._objects = [];
    this._layers = [];

    this._done = false;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  show() {
    function updateLayers() {
      this._done = true;
      for (let index = 0; index < this._objects.length; index++) {
        let obj = this._objects[index];
        let layer = this._layers[index];
        if (!obj.done) {
          this._done = false;
          layer.clear();
          obj.show(layer);
        }
      }
    }

    function showLayers() {
      for (let layer of this._layers) {
        this._p5.image(
          layer,
          -this._width / 2,
          -this._height / 2,
          this._width,
          this._height
        );
      }
    }

    this._p5.background(30, 30, 30);
    this._p5.translate(this._width / 2, this._height / 2);
    updateLayers.bind(this)();
    showLayers.bind(this)();
    if (this._done) {
      console.log("all layers done!");
      this._p5.noLoop();
    }
  }

  add(obj) {
    this._objects.push(obj);
    let layer = this._p5.createGraphics(this._width, this._height);
    layer.background(0, 0, 0, 0);
    layer.translate(this._width / 2, this._height / 2);
    this._layers.push(layer);
    return this;
  }

  push(obj) {
    this.add(obj);
  }

  pop() {
    this._objects.pop();
    this._layers.pop();
  }
}

export default Scene;
