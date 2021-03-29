const $math = require("mathjs");

function CoordinateSystem({ ox, oy, width, height, xInterval, yInterval, grid }) {
    this.ox = ox;
    this.oy = oy;
    this.width = width;
    this.height = height;
    this.xInterval = xInterval;
    this.yInterval = yInterval ? yInterval : xInterval;
    this.grid = grid == undefined ? true : grid;
    this.xMax = this.width / this.xInterval / 2;
    this.xMin = - this.xMax;
    this.yMax = this.height / this.yInterval / 2;
    this.yMin = -this.yMax


    this.outOfRange = (p) => {
        return p.x > this.xMax || p.x < this.xMin || p.y > this.yMax || p.y < this.yMin;
    }

    // 函数图像
    this.showFunctions = (p5, fs) => {
        let interval = 0.1;
        p5.noFill();
        p5.stroke(255);
        for (let f of fs) {
            p5.beginShape();
            for (let x = this.xMin; x <= this.xMax; x += interval) {
                let y = f(x);
                if (this.outOfRange({ x: x, y: y })) continue;
                p5.vertex(this.ox + x * this.xInterval, this.oy - y * this.yInterval);
            }
            p5.endShape();
        }
    }


    // 点
    this.showPoints = (p5, points) => {
        for (let p of points) {
            p5.circle(this.ox + p.x * this.xInterval, this.oy - p.y * this.yInterval, 6);
        }
    }

    this.showComplexes = (p5, complexes, arrow = true) => {
        p5.stroke(255);
        p5.fill(255);
        for (let c of complexes) {
            if (arrow) {
                p5.line(this.ox, this.oy, this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval);
                let rc1 = $math.complex({ r: 1, phi: $math.pi * 4 / 5 }).mul($math.complex({r: 0.2, phi: c.arg()})).add(c);
                let rc2 = $math.complex({ r: 1, phi: -$math.pi * 4 / 5 }).mul($math.complex({r: 0.2, phi: c.arg()})).add(c);
                p5.beginShape();
                p5.vertex(this.ox + rc1.re * this.xInterval, this.oy - rc1.im * this.yInterval);
                p5.vertex(this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval);
                p5.vertex(this.ox + rc2.re * this.xInterval, this.oy - rc2.im * this.yInterval);
                p5.endShape(p5.CLOSE);
            } else {
                p5.circle(this.ox + c.re * this.xInterval, this.oy - c.im * this.yInterval, 6);
            }
        }
    }


    // 坐标系
    this.show = (p5) => {
        p5.stroke(255);
        p5.fill(255);

        // x-axis 
        p5.line(this.ox - this.width / 2, this.oy, this.ox + this.width / 2, this.oy);
        // y-axis
        p5.line(this.ox, this.oy - this.height / 2, this.ox, this.oy + this.height / 2);


        p5.stroke(255, 100);
        for (let x = 0, i = 0; x <= this.width / 2; x += this.xInterval, i++) {
            if (this.grid) {
                p5.line(this.ox + x, this.oy - this.height / 2, this.ox + x, this.oy + this.height / 2);
                p5.line(this.ox - x, this.oy - height / 2, this.ox - x, this.oy + this.height / 2);
            }

            p5.text(i, this.ox + x + 5, this.oy + 15);
            p5.text(-i, this.ox - x + 5, this.oy + 15);
            p5.circle(this.ox + x, this.oy, 5);
            p5.circle(this.ox - x, this.oy, 5);
        }

        for (let y = 0, i = 0; y <= this.height / 2; y += this.yInterval, i++) {
            if (this.grid) {
                p5.line(this.ox - this.width / 2, this.oy + y, this.ox + this.width / 2, this.oy + y);
                p5.line(this.ox - this.width / 2, this.oy - y, this.ox + this.width / 2, this.oy - y);
            }

            if (i != 0) {
                p5.text(i, this.ox - 15, this.oy - y - 5);
                p5.text(-i, this.ox - 20, this.oy + y - 5);
            }
            p5.circle(this.ox, this.oy - y, 5);
            p5.circle(this.ox, this.oy + y, 5);
        }

    };
}

export {
    CoordinateSystem
}