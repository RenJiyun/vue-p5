/**
 * 数学对象均需要关联特定的坐标系，并且坐标由复数表示
 */
const $math = require("mathjs");

class Mobj {
  constructor() {
    let [config] = arguments;
    this.config = config;
    this.coord = config.coord;

    this.done = false;
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
      let { x, y } = this.coord.toSceneCoord(
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
      let { x, y } = this.coord.toSceneCoord(
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
      canvas.vertex(...this.coord.toSceneCoord(x, this.f(x)));
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
    canvas.line(...this.coord.toSceneCoord(s), ...this.coord.toSceneCoord(e));
    let se = e.sub(s);
    let angle = ($math.pi / 6) * 5;
    let lc = e.add(se.mul($math.complex({ r: 0.2 / se.abs(), phi: angle })));
    let rc = e.add(se.mul($math.complex({ r: 0.2 / se.abs(), phi: -angle })));
    canvas.fill(255);
    canvas.noStroke();
    canvas.beginShape();
    canvas.vertex(...this.coord.toSceneCoord(e));
    canvas.vertex(...this.coord.toSceneCoord(lc));
    canvas.vertex(...this.coord.toSceneCoord(rc));
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
  //     ...this.coord.toSceneCoord(this.p),
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
        ...this.coord.toSceneCoord(this.trace[i]),
        this.coord.toSceneLength(r)
      );
    }

  }

  addToVf(vf) {
    this.vf = vf;
  }
}

export { Mobj, Circle, Function, Vector, VetorField, Partical };
