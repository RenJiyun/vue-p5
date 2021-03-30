const $math = require("mathjs");
class Circle {
    constructor(x0, y0, r) {
        this.x0 = x0;
        this.y0 = y0;
        this.r = r;
    }

    show(canvas) {
        canvas.noFill();
        canvas.stroke(255);
        canvas.circle(this.x0, this.y0, this.r);
    }

    get points() {
        return () => {
            let ret = [];
            let delta = 0.05;
            for (let angle = 0; angle <= $math.pi * 2 + delta; angle += delta) {
                ret.push({
                    x: this.x0 + $math.cos(angle) * this.r,
                    y: this.y0 + $math.sin(angle) * this.r,
                    shape: true
                });
            }
            return ret;
        }

    }

}

class Line {
    constructor(x0, y0, theta) {
        this.x0 = x0;
        this.y0 = y0;
        this.theta = theta;
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
