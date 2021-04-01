/**
 * 数学对象均需要关联特定的坐标系，并且坐标由复数表示
 */
const $math = require("mathjs");

class Mobj {
    constructor(coord) {
        this.coord = coord;
        this.coord.add(this);
        this._done = false;
    }

    coordChanged() {
        this._done = false;
    }

    get done() {
        return this._done;
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
            let { x, y } = this.coord.toSceneCoord(this.c0.add($math.complex({ r: this.r, phi: angle })));
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
        for (let angle = 0; angle <= ($math.pi * 2 + delta) * progress; angle += delta) {
            let { x, y } = this.coord.toSceneCoord(this.c0.add($math.complex({ r: this.r, phi: angle })));
            canvas.vertex(x, y);
        }
        canvas.endShape();

        if (progress >= 1) {
            this._done = true;
        }
    }
}

class Line {
    constructor(x0, y0, theta) {
        this.x0 = x0;
        this.y0 = y0;
        this.theta = theta;
        this.c0 = $math.complex(this.x0, this.y0);
    }

    get points() {
        return (env) => {
            let ret = []
            let delta = 0.5;
            for (let r = 0; ; r += delta) {
                let dc = $math.complex({ r: r, phi: this.theta });
                let c1 = this.c0.add(dc)
                let c2 = this.c0.add(dc.neg());
                // if (env.outOfRange({x: c1.re, y: c1.im}) && env.outOfRange({x: c2.re, y: c2.im})) {
                //     break;
                // }

                console.log(env)
                if (ret.length > 3) {
                    break;
                }
                ret.push({
                    x: c1.re,
                    y: c1.im,
                    shape: true
                })
                ret.unshift({
                    x: c2.re,
                    y: c2.im,
                    shape: true
                })
            }

            return ret;
        }
    }
}

class Function {
    constructor(f) {
        this.f = f;
    }

    get points() {
        return (env) => {
            let ret = [];
            let delta = 0.05;
            for (let x = env.xMin; x <= env.xMax + delta; x += delta) {
                ret.push({
                    x: x,
                    y: this.f(x),
                    shape: true
                })
            }
            return ret;
        }
    }

}

class Triangle {
    constructor(x0, y0, x1, y1, x2, y2) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    get points() {
        return () => {
            return [
                { x: this.x0, y: this.y0, shape: true },
                { x: this.x1, y: this.y1, shape: true },
                { x: this.x2, y: this.y2, shape: true },
                { x: this.x0, y: this.y0, shape: true },
            ]
        }

    }
}

class Polygon {
    constructor() {

    }
}

export {
    Circle, Line, Function, Triangle, Polygon
}
