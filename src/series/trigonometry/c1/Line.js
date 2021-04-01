import { Mobj } from '@/lib/Mobj'
const $math = require("mathjs");

class Line extends Mobj {
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
            canvas.strokeWeight(7)
            canvas.stroke(255, 0, 0);
            
            let p = this.coord.toSceneCoord(this.c0);
            let p1 = this.coord.toSceneCoord(this.c0.add($math.multiply(edge, progress)));
            canvas.line(p.x, p.y, p1.x, p1.y)
        }
    }
}

export { Line }