import Mode from "./Mode";
import SceneObj from "./SceneObj";
import Transformation from "./Transformation";


const EVENTS = [
  "mouseClicked",
  "mouseWheel",
  "mousePressed",
  "mouseReleased",
  "mouseMoved",
  "mouseDragged",
  "keyPressed",
  "keyReleased",
];
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

    this._registeredEvents = {};

    EVENTS.forEach((e) => {
      this._p5[e] = (event) => {
        // 分发至注册好的对象
        (this._registeredEvents[e] || []).forEach((element) => {
          if (event.layerX != undefined && event.layerY != undefined) {
            event.sceneX = event.layerX - this._width / 2;
            event.sceneY = event.layerY - this._height / 2;
          }
          if (typeof element == "function") {
            element(event, this);
          } else if (element instanceof SceneObj) {
            element[e](event, this);
          } else {
            throw new Error("unsuppported event callback");
          }
        });

        // 分发至本对象
        if (this[e] != undefined && typeof this[e] == "function") {
          this[e](event);
        }
      };
    });

    this.add(new Mode());
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

    this._p5.background(245, 245, 245);
    this._p5.translate(this._width / 2, this._height / 2);
    updateLayers.bind(this)();
    showLayers.bind(this)();
    if (this._done) {
      console.log("all layers done!");
      this._p5.noLoop();
    }
  }

  refresh() {
    this._objects.forEach((obj) => {
      if (obj instanceof Transformation) {
        obj._reset();
      }
    });

    // TODO 这种处理方式应该是有问题的，暂时这样
    this._done = false;
    this._p5.loop();
  }

  add(obj) {
    this._objects.push(obj);
    let layer = this._p5.createGraphics(this._width, this._height);
    layer.background(0, 0, 0, 0);
    layer.translate(this._width / 2, this._height / 2);
    this._layers.push(layer);

    EVENTS.forEach((e) => {
      if (obj[e] != undefined && typeof obj[e] == "function") {
        this.registerEvent(e, obj);
      }
    });

    return this;
  }

  push(obj) {
    this.add(obj);
  }

  pop() {
    this._objects.pop();
    this._layers.pop();
  }

  registerEvent(eventName, cb) {
    if (this._registeredEvents[eventName] == undefined) {
      this._registeredEvents[eventName] = [];
    }

    this._registeredEvents[eventName].push(cb);
  }
}

export default Scene;
