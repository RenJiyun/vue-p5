import { Mobj } from '@/lib/Mobj'
const $math = require("mathjs");
const $bazier = require('bezier-easing');


class Polygon extends Mobj {
    constructor(coord, vertexes) {
        super(coord);
        this.vertexes = vertexes;
        this.vertexes.push(vertexes[0])

        this.duration = 1000;
        this.current = 0;

        this.length = 0;
        for (let i = 0; i < this.vertexes.length - 1; i++) {
            let edge = this.vertexes[i + 1].add(this.vertexes[i].neg());
            this.length = this.length + edge.abs()
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
            let currentLength = canvas.map(this.current, 0, this.duration, 0, this.length) * this.easing(progress);

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
                canvas.vertex(...this.coord.toSceneCoord(this.vertexes[0]))
            }
            canvas.endShape();
        }
    }

}

export { Polygon }