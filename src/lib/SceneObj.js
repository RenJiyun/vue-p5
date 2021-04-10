class ExecStructure {
  constructor() {}

  submit() {
    return (fn) => {
      if (fn) {
        if (this instanceof ExecNode) {
          fn(this);
        } else {
          this._ess.forEach((es) => {
            es.submit()(fn);
          });
        }
      } else {
        if (this instanceof ExecNode && !this.done) {
          return [this];
        } else if (this instanceof Sequence) {
          let es = this._ess.find((e) => !e.done);
          if (!es) {
            return [];
          }
          return es.submit()();
        } else if (this instanceof Parallel) {
          return this._ess
            .map((es) => es.submit()())
            .reduce((a, b) => a.concat(b), []);
        }
        return [];
      }
    };
  }
}

// 执行节点
class ExecNode extends ExecStructure {
  constructor(fn, layer) {
    super();
    this._fn = fn;
    this._layer = layer;
    this._done = false;
    this._lt = 0;
  }

  get done() {
    return this._done;
  }

  get layer() {
    return this._layer;
  }

  execute(that, canvas, p5) {
    if (this._duration != undefined && this._lt >= this._duration) {
      this._done = true;
    }

    // 使得_fn有对状态_done的控制权
    this._call(that, canvas);

    if (this._duration != undefined) {
      this._lt += p5.deltaTime;
    }
  }

  _call(that, canvas) {
    this._fn.bind(that)(
      canvas,
      this,
      ((_) => {
        // 执行节点和Mobj的状态均应该设置成指定的值
        this._done = _;
        that._done = _;
      }).bind(this)
    );
  }

  withDuration(duration) {
    if (this._duration != undefined) {
      throw new Error("duration is already set");
    }
    this._duration = duration;
    return this;
  }

  getDurationState() {
    if (this._duration == undefined) {
      throw new Error("duration is not set");
    }

    return {
      lt: this._lt,
      duration: this._duration,
    };
  }

  getMobjState(name, fn) {
    if (this[name] == undefined) {
      this[name] = fn();
    }
    return this[name];
  }
}

class Sequence extends ExecStructure {
  constructor(ess) {
    super();
    this._ess = ess;
  }

  get done() {
    return this._ess.every((e) => e.done);
  }
}

class Parallel extends ExecStructure {
  constructor(ess) {
    super();
    this._ess = ess;
  }

  get done() {
    return this._ess.every((e) => e.done);
  }
}

class SceneObj {
  constructor(p5config, aconfig, econfig) {
    this._p5config = p5config;
    this._aconfig = aconfig;
    this._coord = econfig.coord;
    this._p5 = econfig.p5;
    this._done = false;
    this._layers = [];
    this._initialized = false;
    this._execGraph;
  }

  _getProgress() {
    let { lt, duration } = arguments[0];
    lt = Math.min(lt, duration);
    return lt / duration;
  }

  _configCanvas(canvas) {
    if (this._p5config.fill == undefined) {
      canvas.fill(255);
    } else if (this._p5config.fill == false) {
      canvas.noFill();
    } else {
      canvas.fill(...this._p5config.fill);
    }

    if (this._p5config.stroke == undefined) {
      canvas.stroke(255);
    } else if (this._p5config.stroke == false) {
      canvas.noStroke();
    } else {
      canvas.stroke(...this._p5config.stroke);
    }
    
    canvas.strokeWeight(this._p5config.strokeWeight || 1);

    canvas.strokeJoin(canvas.ROUND);
  }

  get done() {
    return this._done;
  }

  get _econfig() {
    return {
      coord: this._coord,
      p5: this._p5,
    };
  }

  _sequence(...ess) {
    return new Sequence(ess);
  }

  _parallel(...ess) {
    return new Parallel(ess);
  }

  _execNode(fn, layer) {
    return new ExecNode(fn, layer);
  }

  /************************************************ math hepler function *************************************************************/

  toNativeCoord() {
    return this._coord.toNativeCoord(...arguments);
  }

  toNativeLength() {
    return this._coord.toNativeLength(...arguments);
  }

  toNativeAngle(angle) {
    return -angle;
  }

  get xrange() {
    return [this._coord.xMin, this._coord.xMax];
  }

  map(v, vmin, vmax, mmin, mmax) {
    return this._p5.map(v, vmin, vmax, mmin, mmax);
  }

  /*************************************************************************************************************/

  _init() {
    // 生成所需的图层
    let [width, height] = [this._p5.width, this._p5.height];
    for (let i = 0; i < this._layerNum; i++) {
      let layer = this._p5.createGraphics(width, height);
      layer.background(0, 0, 0, 0);
      layer.translate(width / 2, height / 2);
      this._layers.push(layer);
    }

    // 提交执行图
    this._execGraph = this._submit();
    this._initialized = true;
  }

  _reset() {
    this._done = false;
    this._execGraph((es) => (es._done = false));
  }

  show(canvas) {
    if (!this._initialized) {
      this._init();
    }

    let clearedLayers = new Set();

    let ens = this._execGraph();

    this._done = ens.length == 0;
    for (let node of ens) {
      let layer = this._layers[node.layer];
      if (!clearedLayers.has(layer)) {
        layer.clear();
        clearedLayers.add(layer);
      }
      node.execute(this, layer, this._p5);
    }

    this._layers.forEach((layer) => {
      canvas.image(
        layer,
        -layer.width / 2,
        -layer.height / 2,
        layer.width,
        layer.height
      );
    });

    return this._done;
  }
}

export default SceneObj;
