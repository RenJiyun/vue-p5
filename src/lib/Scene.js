import { Animation } from "./Animation";

class Scene {
  constructor(config) {
    let { canvas, width, height } = config;
    this.canvas = canvas;
    this.width = width;
    this.height = height;

    this.canvas.createCanvas(this.width, this.height);
    this.objects = [];

    // 每个对象均绘制在私有的图层上，场景由图层叠加形成
    this.layers = [];

    //每个场景拥有统一的时间轴
    this.t = 0;

    this.done = false;
  }

  show() {
    function updateLayers() {
      for (let index = 0; index < this.objects.length; index++) {
        let obj = this.objects[index];
        let layer = this.layers[index];
        if (!obj.done) {
          layer.clear();
          obj.show(layer, this.t, this.canvas.deltaTime);
        } else if (obj instanceof Animation) {
          this.objects[index] = obj.obj;
        }
      }
    }

    function showLayers() {
      for (let layer of this.layers) {
        this.canvas.image(
          layer,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
      }
    }


    this.t += this.canvas.deltaTime;
    this.canvas.background(30, 30, 30);
    this.canvas.translate(this.width / 2, this.height / 2);
    updateLayers.call(this);
    showLayers.call(this);
    if (this.done) {
      this.canvas.noLoop();
    }
  }

  add(obj) {
    this.objects.push(obj);
    let layer = this.canvas.createGraphics(this.width, this.height);
    layer.background(0, 0, 0, 0);
    layer.translate(this.width / 2, this.height / 2);
    this.layers.push(layer);

    return this;
  }

  push(obj) {
    this.add(obj);
  }

  pop() {
    this.objects.pop();
    this.layers.pop();
  }
}

export { Scene };
