/**
 * 数学对象均需要关联特定的坐标系，并且坐标由复数表示
 */
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

class Circle extends Mobj {
  constructor(coord, c0, r) {
    super(coord);
    this.c0 = c0;
    this.r = r;
  }

  show(canvas) {
    canvas.noFill();
    canvas.stroke(255);
    canvas.beginShape();
    let delta = 0.05;
    for (let angle = 0; angle <= $math.pi * 2 + delta; angle += delta) {
      let { x, y } = this.coord.toNativeCoord(
        this.c0.add($math.complex({ r: this.r, phi: angle }))
      );
      canvas.vertex(x, y);
    }
    canvas.endShape();
    this._done = true;
  }

  create(canvas, progress) {
    canvas.noFill();
    canvas.stroke(255);
    canvas.beginShape();
    let delta = 0.05;
    for (
      let angle = 0;
      angle <= ($math.pi * 2 + delta) * progress;
      angle += delta
    ) {
      let { x, y } = this.coord.toNativeCoord(
        this.c0.add($math.complex({ r: this.r, phi: angle }))
      );
      canvas.vertex(x, y);
    }
    canvas.endShape();

    if (progress >= 1) {
      this._done = true;
    }
  }
}

class Function extends Mobj {
  constructor(coord, f, config) {
    super(coord);
    this.f = f;
    this.config = config || {};
    // this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  show() {
    let [canvas, t] = arguments;
    let progress = Math.min(t / (this.config.duration || 1000), 1);

    progress = this.config.easing ? this.config.easing(progress) : progress;
    let delta = this.config.delta || 0.1;

    canvas.noFill();
    canvas.stroke(255);
    canvas.beginShape();
    let xMax =
      this.coord.xMin + (this.coord.xMax + delta - this.coord.xMin) * progress;
    for (let x = this.coord.xMin; x <= xMax; x += delta) {
      canvas.vertex(...this.coord.toNativeCoord(x, this.f(x)));
    }
    canvas.endShape();
  }
}

class Vector extends Mobj {
  constructor(s, e, ...rest) {
    super(...rest);
    this.s = s;
    this.e = e;
  }

  show() {
    let [canvas] = arguments;
    let s = this.s;
    let e = this.e;
    canvas.noFill();
    canvas.stroke(255);
    canvas.line(...this.coord.toNativeCoord(s), ...this.coord.toNativeCoord(e));
    let se = e.sub(s);
    let angle = ($math.pi / 6) * 5;
    let lc = e.add(se.mul($math.complex({ r: 0.2 / se.abs(), phi: angle })));
    let rc = e.add(se.mul($math.complex({ r: 0.2 / se.abs(), phi: -angle })));
    canvas.fill(255);
    canvas.noStroke();
    canvas.beginShape();
    canvas.vertex(...this.coord.toNativeCoord(e));
    canvas.vertex(...this.coord.toNativeCoord(lc));
    canvas.vertex(...this.coord.toNativeCoord(rc));
    canvas.endShape(canvas.CLOSE);
    this._done = true;
  }
}

class VetorField extends Mobj {
  constructor(f, ...rest) {
    super(...rest);
    this.f = f;
  }

  show() {
    let [canvas, t] = arguments;
    canvas.noFill();
    canvas.stroke(255);
    let delta = this.config.delta || 1.5;
    for (let x = this.coord.xMin; x <= this.coord.xMax; x += delta) {
      for (let y = this.coord.yMin; y <= this.coord.yMax; y += delta) {
        let c = $math.complex(x, y);
        let fc = this.f(c, t);
        let ec = c.add(fc);

        new Vector(c, ec, { coord: this.coord }).show(canvas);
      }
    }

    this.done = true;
  }

  add(vf) {
    return new VetorField(
      (c, t) => {
        let v1 = this.f(c, t);
        let v2 = vf.f(c, t);
        return v1.add(v2);
      },
      {
        coord: this.coord,
      }
    );
  }
}

class Partical extends Mobj {
  constructor(s, v, ...rest) {
    super(...rest);
    this.p = s;
    this.v = v;
    this.trace = [];
    this.trace.push(this.p);
  }

  // show() {
  //   let [canvas, t, deltaTime] = arguments;
  //   canvas.fill(255, 0, 0);
  //   canvas.noStroke();
  //   this.p = this.p.add($math.multiply(this.v, deltaTime / 1000));
  //   let [collided, newV] = this.ellipse.collide(this.p, this.v);
  //   this.v = newV;
  //   if (collided) {
  //     this.current = 0;
  //   }
  //   canvas.circle(
  //     ...this.coord.toNativeCoord(this.p),
  //     this.coord.toSceneLength(0.5)
  //   );
  // }

  show() {
    let [canvas, t, deltaTime] = arguments;
    canvas.noStroke();
    this.p = this.p.add($math.multiply(this.v, deltaTime / 1000));

    this.v = this.vf ? this.vf.f(this.p, t) : this.v;
    this.trace.push(this.p);
    if (this.trace.length >= 10) {
      this.trace.shift();
    }

    for (let i = 0; i < this.trace.length; i++) {
      let r = canvas.map(i, 0, this.trace.length - 1, 0.01, 0.2);
      let t = canvas.map(i, 0, this.trace.length - 1, 10, 255);
      canvas.fill(0, 0, 255, t);
      canvas.circle(
        ...this.coord.toNativeCoord(this.trace[i]),
        this.coord.toSceneLength(r)
      );
    }
  }

  addToVf(vf) {
    this.vf = vf;
  }
}

class Polyline extends Mobj {
  constructor() {
    let [vertexes, ...rest] = arguments;
    super(...rest);
    this.vertexes = vertexes;

    this.length = 0;
    for (let i = 0; i < this.vertexes.length - 1; i++) {
      let edge = this.vertexes[i + 1].add(this.vertexes[i].neg());
      this.length = this.length + edge.abs();
    }

    this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  draw() {
    let duration = 1000;
    let [canvas, lt] = arguments;
    canvas.noFill();
    canvas.stroke(0, 255, 0, 100);
    canvas.strokeJoin(canvas.ROUND);
    canvas.strokeWeight(20);

    

    lt = Math.min(lt, duration);

    let progress = lt / duration;
    let currentLength =
      canvas.map(lt, 0, duration, 0, this.length) * this.easing(progress);


    canvas.beginShape();
    for (let i = 0; i < this.vertexes.length - 1; i++) {
      let sv = this.vertexes[i];
      let ev = this.vertexes[i + 1];
      canvas.vertex(...this.coord.toNativeCoord(sv));
      let edge = ev.sub(sv);
      if (currentLength > edge.abs()) {
        currentLength -= edge.abs();
        continue;
      } else {
        let ratio = currentLength / edge.abs();
        let cc = sv.add($math.multiply(edge, ratio));
        canvas.vertex(...this.coord.toNativeCoord(cc));
        break;
      }
    }
    canvas.endShape();

    if (lt >= duration) {
      this.next();
    }
  }

  states() {
    return [this.draw];
  }
}

export { Mobj, Circle, Function, Vector, VetorField, Partical, Polyline };
