import { Mobj } from "@/lib/Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

class Segment extends Mobj {
  constructor(coord, c0, c1) {
    super(coord);
    this.c0 = c1;
    this.c1 = c0;

    this.duration = 1000;
    this.current = 0;
  }

  show(canvas, deltaTime) {
    if (!this._done) {
      this.current += deltaTime;
      this.current = Math.min(this.current, this.duration);
      if (this.current >= this.duration) {
        this._done = true;
      }

      let progress = this.current / this.duration;
      let edge = this.c1.add(this.c0.neg());
      canvas.noFill();
      canvas.strokeWeight(7);
      canvas.stroke(255, 0, 0);

      let p = this.coord.toSceneCoord(this.c0);
      let p1 = this.coord.toSceneCoord(
        this.c0.add($math.multiply(edge, progress))
      );
      canvas.line(p.x, p.y, p1.x, p1.y);
    }
  }
}

class Polygon extends Mobj {
  constructor(coord, vertexes) {
    super(coord);
    this.vertexes = vertexes;
    this.vertexes.push(vertexes[0]);

    this.duration = 1000;
    this.current = 0;

    this.length = 0;
    for (let i = 0; i < this.vertexes.length - 1; i++) {
      let edge = this.vertexes[i + 1].add(this.vertexes[i].neg());
      this.length = this.length + edge.abs();
    }

    this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  show(canvas, deltaTime) {
    if (!this._done) {
      canvas.noFill();
      canvas.stroke(255);

      this.current += deltaTime;
      this.current = Math.min(this.current, this.duration);

      if (this.current >= this.duration) {
        this._done = true;
      }

      let progress = this.current / this.duration;
      let currentLength =
        canvas.map(this.current, 0, this.duration, 0, this.length) *
        this.easing(progress);

      canvas.beginShape();
      for (let i = 0; i < this.vertexes.length - 1; i++) {
        let sv = this.vertexes[i];
        let ev = this.vertexes[i + 1];
        canvas.vertex(...this.coord.toSceneCoord(sv));
        let edge = ev.sub(sv);
        if (currentLength > edge.abs()) {
          currentLength -= edge.abs();
          // TODO 精度问题：剩余的currentLength有可能比最后一条边长还大，此时continue会使得循环退出，从而最后一条边消失
          continue;
        } else {
          let ratio = currentLength / edge.abs();
          let cc = sv.add($math.multiply(edge, ratio));
          canvas.vertex(...this.coord.toSceneCoord(cc));
          break;
        }
      }

      // 用于修复上述的精度问题
      if (this._done) {
        canvas.vertex(...this.coord.toSceneCoord(this.vertexes[0]));
      }
      canvas.endShape();
    }
  }
}

class TriangleAndCircle extends Mobj {
  constructor(coord, r, f, theta0, theta1, theta2) {
    super(coord);

    this.r = r;
    this.f = f;

    this.theta0 = theta0;
    this.theta1 = theta1;
    this.theta2 = theta2;

    this.duration = 5000;
    this.current = 0;
  }

  show(canvas, deltaTime) {
    if (!this._done) {
      this.current += deltaTime;
      this.current = Math.min(this.current, this.duration);

      if (this.current >= this.duration) {
        this._done = true;
      }

      let progress = this.current / this.duration;
      // c为当前坐标，nc为法线
      let { c, nc, l } = this.f(progress);
      // 圆心的当前坐标
      let o = c.add($math.complex({ r: this.r, phi: nc.arg() }));
      let oc = c.add(o.neg());
      // 暂时定成顺时针方向滚动
      let theta = -l / this.r;

      let rc0 = oc.mul($math.complex({ r: 1, phi: theta + this.theta0 }));
      let rc1 = oc.mul($math.complex({ r: 1, phi: theta + this.theta1 }));
      let rc2 = oc.mul($math.complex({ r: 1, phi: theta + this.theta2 }));

      let p0 = rc0.add(o);
      let p1 = rc1.add(o);
      let p2 = rc2.add(o);

      canvas.fill(255, 0, 0);
      canvas.noStroke();
      canvas.beginShape();
      canvas.vertex(...this.coord.toSceneCoord(p0));
      canvas.vertex(...this.coord.toSceneCoord(p1));
      canvas.vertex(...this.coord.toSceneCoord(p2));
      canvas.endShape(canvas.CLOSE);
      canvas.noFill();
      canvas.stroke(255);
      canvas.circle(
        ...this.coord.toSceneCoord(o),
        2 * this.coord.toSceneLength(this.r)
      );
    }
  }
}

class QQCircle extends Mobj {
  constructor(coord, o, r) {
    super(coord);
    this.o = o;
    this.r = r;
    this.current = 0;
  }

  show(canvas, deltaTime) {
    this.current += deltaTime;
    canvas.noFill();
    canvas.stroke(255);
    let w = 2 * this.coord.toSceneLength(this.r);
    let h = w + this.coord.toSceneLength(2 * $math.sin(this.current * 0.006));
    canvas.ellipse(...this.coord.toSceneCoord(this.o), w, h);
  }
}



// class PerlinNosieField extends Mobj {
//   constructor(coord) {
//     super(coord);

//     this.current = 0;
//   }

//   show(canvas, deltaTime) {
//     this.current += deltaTime;
//     canvas.noFill();
//     canvas.stroke(255);

//     let interval = 2;
//     for (let x = this.coord.xMin; x <= this.coord.xMax; x += interval) {
//       for (let y = this.coord.yMin; y <= this.coord.yMax; y += interval) {
//         let n = canvas.noise(x, y);
//         let s = $math.complex(x, y);
//         let e = s.add($math.complex({ r: n, phi: $math.pi * 2 * n }));

//         new Vector(this.coord, s, e).show(canvas);
//       }
//     }

//     this._done = true;
//   }
// }



class Line extends Mobj {
  constructor(coord, c0, c1) {
    super(coord);
    this.c0 = c0;
    this.c1 = c1;

    this.duration = 1000;
    this.easing = $bazier(1, 0.08, 0.85, 0.09);
  }

  show(canvas, deltaTime) {
    let c0 = this.c0;
    let c1 = this.c1;
    canvas.noFill();
    canvas.stroke(255);

    this.current += deltaTime;
    let progress = Math.min(this.current / this.duration, 1);

    if (!this._done) {
      let c0c1 = c1.sub(c0);
      let m = $math.multiply(c0.add(c1), 0.5);
      let hd = c1.sub(c0).abs() / 2;
      let hl = hd * this.easing(progress);
      let lc = m.add($math.complex({ r: -hl, phi: c0c1.arg() }));
      let rc = m.add($math.complex({ r: hl, phi: c0c1.arg() }));
      canvas.line(
        ...this.coord.toSceneCoord(lc),
        ...this.coord.toSceneCoord(rc)
      );
    }

    if (progress >= 1) {
      this._done = true;
    }
  }

  collide(c, v) {
    let c0 = this.c0;
    let c1 = this.c1;
    let c0c1 = c1.sub(c0);
    let c0c = c.sub(c0);
    let angle = c0c.arg() - c0c1.arg();
    if (Math.abs(angle) > 0.01) {
      return [false, v];
    }
    let angle_ingoing_c0c1 = v.arg() - c0c1.arg();
    let d_outgoing = c0c1.mul(
      $math.complex({ r: 1, phi: -angle_ingoing_c0c1 })
    );
    return [true, $math.complex({ r: v.abs(), phi: d_outgoing.arg() })];
  }
}

class Ellipse extends Mobj {
  constructor(coord, a, b) {
    super(coord);
    this.a = a;
    this.b = b;
  }

  show(canvas) {
    canvas.noFill();
    canvas.stroke(255);
    let delta = 0.1;
    canvas.beginShape();
    for (let theta = 0; theta <= $math.pi * 2 + delta; theta += delta) {
      canvas.vertex(
        ...this.coord.toSceneCoord(
          this.a * $math.cos(theta),
          this.b * $math.sin(theta)
        )
      );
    }

    canvas.endShape();

    this._done = true;
  }

  collide(c, v) {
    let x = c.re;
    let y = c.im;
    let a = this.a;
    let b = this.b;
    let pow = Math.pow;
    let diff = pow(x, 2) / pow(a, 2) + pow(y, 2) / pow(b, 2) - 1;
    if (diff >= 0.1 || diff <= -0.1) {
      console.log(diff);
      return [false, v];
    }

    let line = new Line(
      this.coord,
      $math.complex(pow(a, 2) / x, 0),
      $math.complex(0, pow(b, 2) / y)
    );
    return line.collide(c, v);
  }
}

export {
  Segment,
  Polygon,
  TriangleAndCircle,
  QQCircle,
  Line,
  Ellipse,
};