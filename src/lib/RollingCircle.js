
const $math = require("mathjs");

class RollingCircle {
    constructor(r, v, f) {
        this.r = r;
        this.v = v;
        this.f = f;
        this.t = 0;
    }

    get points() {
        return (env) => {
            let ret = [];


            let deltaTime = env.deltaTime;
            this.t += deltaTime;

            let l = this.t * this.v / 1000;

            // c为当前坐标，nc为法线
            let { c, nc } = this.f(l);
            // 圆心的当前坐标
            let o = c.add($math.complex({ r: this.r, phi: nc.arg() }));
            let oc = c.add(o.neg());
            // 暂时定成顺时针方向滚动
            let theta = -l / this.r;
            let rc = oc.mul($math.complex({ r: 1, phi: theta }));
            let p = rc.add(o);
            ret.push({
                x: p.re,
                y: p.im,
            })
            let delta = 0.05;
            for (let angle = 0; angle <= $math.pi * 2 + delta; angle += delta) {
                ret.push({
                    x: o.re + $math.cos(angle) * this.r,
                    y: o.im + $math.sin(angle) * this.r,
                    shape: true

                })
            }
            return ret;
        }
    }
}

class RollingCircleWithTriangle {
    constructor(r, v, f) {
        this.r = r;
        this.v = v;
        this.f = f;
        this.t = 0;
    }

    get points() {
        return (env) => {
            let ret = [];


            let deltaTime = env.deltaTime;
            this.t += deltaTime;

            let l = this.t * this.v / 1000;

            // c为当前坐标，nc为法线
            let { c, nc } = this.f(l);
            // 圆心的当前坐标
            let o = c.add($math.complex({ r: this.r, phi: nc.arg() }));
            let oc = c.add(o.neg());
            // 暂时定成顺时针方向滚动
            let theta = -l / this.r;
            let rc = oc.mul($math.complex({ r: 1, phi: theta }));
            let p = rc.add(o);
            ret.push({
                x: p.re,
                y: p.im,
            })
            let delta = 0.05;
            for (let angle = 0; angle <= $math.pi * 2 + delta; angle += delta) {
                ret.push({
                    x: o.re + $math.cos(angle) * this.r,
                    y: o.im + $math.sin(angle) * this.r,
                    shape: true

                })
            }
            return ret;
        }
    }
}


export {
    RollingCircle, RollingCircleWithTriangle
}