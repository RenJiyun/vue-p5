const $math = require("mathjs");

class Coord {
    constructor(config) {
        let { defaultCanvas, ox, oy, width, height, xInterval, yInterval, grid, labelInterval } = config;
        this.defaultCanvas = defaultCanvas;
        this.ox = ox;
        this.oy = oy;
        this._width = width;
        this._height = height;
        this._xInterval = xInterval;
        this._yInterval = yInterval ? yInterval : xInterval;
        this._grid = grid == undefined ? true : grid;
        this.xMax = this.width / this.xInterval / 2;
        this.xMin = - this.xMax;
        this.yMax = this.height / this.yInterval / 2;
        this.yMin = -this.yMax
        this._labelInterval = labelInterval == undefined ? 1 : labelInterval;
        this._scale = 1;


        this._done = false;

        this.mobjs = [];
    }

    add(mobj) {
        this.mobjs.push(mobj);
    }


    get done() {
        return this._done;
    }


    updateConfig() {
        this.xMax = this.width / this.xInterval / 2;
        this.xMin = - this.xMax;
        this.yMax = this.height / this.yInterval / 2;
        this.yMin = -this.yMax
    }


    get labelInterval() {
        return Math.ceil(this._labelInterval / this._scale);
    }

    get width() {
        return this._width * this.scale;
    }

    set width(w) {
        this._width = w;
        this.updateConfig();
    }

    get height() {
        return this._height * this.scale;
    }

    set height(h) {
        this._height = h;
        this.updateConfig();
    }

    get xInterval() {
        return this._xInterval * this.scale;

    }

    set xInterval(xi) {
        this._xInterval = xi;
        this.updateConfig();
    }

    get yInterval() {
        return this._yInterval * this.scale;
    }

    set yInterval(yi) {
        this._yInterval = yi;
        this.updateConfig();
    }


    get grid() {
        return this._grid;
    }

    set grid(flag) {
        this._grid = flag;
    }

    get scale() {
        return this._scale;
    }

    set scale(s) {
        this._scale = s;
    }


    showMobj(canvas = this.defaultCanvas, mobj) {
        canvas.noFill();
        canvas.stroke(255);
        let env = {
            xMin: this.xMin,
            xMax: this.xMax,
            yMin: this.yMin,
            yMax: this.yMax,
            deltaTime: canvas.deltaTime,
            outOfRange: this.outOfRange
        }

        let points = mobj.points(env);
        let shapePoints = points.filter(p => p.shape)
        let nonShapePoints = points.filter(p => !p.shape)

        canvas.beginShape();
        for (let p of shapePoints) {
            let outerP = this.toOuterCoord(p);
            canvas.vertex(outerP.x, outerP.y)
        }
        canvas.endShape();

        canvas.fill(255, 0, 0);
        canvas.noStroke();
        for (let p of nonShapePoints) {
            let outerP = this.toOuterCoord(p);
            canvas.circle(outerP.x, outerP.y, 5);
        }


    }


    outOfRange(p) {
        return p.x > this.xMax || p.x < this.xMin || p.y > this.yMax || p.y < this.yMin;
    }


    toOuterCoord(p) {
        return {
            x: this.ox + p.x * this.xInterval,
            y: this.oy - p.y * this.yInterval
        }
    }

    toSceneCoord(c) {
        return [this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval];
    }

    toSceneLength(l) {
        return l * this.xInterval;
    } 

    // 显示复数
    showComplexes(canvas = this.defaultCanvas, complexes, arrow = true, label = false) {
        let arrowLen = Math.min(this.width, this.height) / 80;

        for (let c of complexes) {
            canvas.stroke(255);
            canvas.fill(255);
            if (arrow) {
                canvas.line(this.ox, this.oy, this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval);

                let rc1 = $math.complex({ r: 1, phi: $math.pi * 4 / 5 }).mul($math.complex({ r: arrowLen, phi: c.arg() })).add(c);
                let rc2 = $math.complex({ r: 1, phi: -$math.pi * 4 / 5 }).mul($math.complex({ r: arrowLen, phi: c.arg() })).add(c);
                canvas.beginShape();
                canvas.vertex(this.ox + rc1.re * this.xInterval, this.oy - rc1.im * this.yInterval);
                canvas.vertex(this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval);
                canvas.vertex(this.ox + rc2.re * this.xInterval, this.oy - rc2.im * this.yInterval);
                canvas.endShape(canvas.CLOSE);
            } else {
                canvas.circle(this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval, 6);
            }

            // 显示标签
            if (label) {
                canvas.noStroke();
                canvas.text(c.format(2),
                    this.ox + c.re * this.xInterval,
                    this.oy - c.im * this.yInterval);
            }

        }
    }

    show(canvas) {
        canvas.stroke(255);
        canvas.fill(255);

        // x-axis 
        canvas.line(this.ox - this.width / 2, this.oy, this.ox + this.width / 2, this.oy);
        // y-axis
        canvas.line(this.ox, this.oy - this.height / 2, this.ox, this.oy + this.height / 2);


        canvas.stroke(255, 100);
        for (let x = 0, i = 0; x <= this.width / 2; x += this.xInterval, i++) {
            if (this.grid) {
                canvas.line(this.ox + x, this.oy - this.height / 2, this.ox + x, this.oy + this.height / 2);
                canvas.line(this.ox - x, this.oy - this.height / 2, this.ox - x, this.oy + this.height / 2);
            }

            if (i % this.labelInterval == 0) {
                canvas.text(i, this.ox + x + 5, this.oy + 15);
                canvas.text(-i, this.ox - x + 5, this.oy + 15);
                canvas.circle(this.ox + x, this.oy, 5);
                canvas.circle(this.ox - x, this.oy, 5);
            }


        }

        for (let y = 0, i = 0; y <= this.height / 2; y += this.yInterval, i++) {
            if (this.grid) {
                canvas.line(this.ox - this.width / 2, this.oy + y, this.ox + this.width / 2, this.oy + y);
                canvas.line(this.ox - this.width / 2, this.oy - y, this.ox + this.width / 2, this.oy - y);
            }

            if (i != 0 && i % this.labelInterval == 0) {
                canvas.text(i, this.ox - 15, this.oy - y - 5);
                canvas.text(-i, this.ox - 20, this.oy + y - 5);
                canvas.circle(this.ox, this.oy - y, 5);
                canvas.circle(this.ox, this.oy + y, 5);
            }

        }
        this._done = true;
    }
}

export {
    Coord
}