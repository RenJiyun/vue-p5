import Mobj from "@/lib/Mobj";
const $math = require("mathjs");
const $bazier = require("bezier-easing");

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

export { TriangleAndCircle, QQCircle };
