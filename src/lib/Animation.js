import { CoordinateSystem } from "./CoordinateSystem";

// 创建动画
function Create(mobj, duration = 500) {
    this.mobj = mobj;
    this.done = false;
    this.duration = duration;
    this.current = 0;

    this.display = (canvas, coord) => {

        // TODO 坐标系自身需要特殊处理，目前坐标系和Mobj的概念不统一
        if (this.mobj instanceof CoordinateSystem) {
            coord = undefined
        }
        this.current += Math.ceil(canvas.deltaTime)
        if (!this.done) {
            let pg = canvas.createGraphics(canvas.width, canvas.height);
            pg.translate(pg.width / 2, pg.height / 2);
            pg.background(0, 0);

            if (coord != undefined) {
                coord.showMobj(pg, this.mobj);
            } else {
                this.mobj.show(pg)
            }

            canvas.scale(canvas.map(this.current, 1, this.duration, 0, 1))
            canvas.image(pg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            if (this.current >= this.duration) {
                this.done = true;
            }
        } else {
            canvas.scale(1);
            if (coord != undefined) {
                coord.showMobj(canvas, this.mobj);
            } else {
                this.mobj.show(canvas)
            }
        }
    }
}

function FadeIn() {

}

function FadeOut() {

}


// 串联动画
function Chain(animations = []) {
    this.animations = animations;

    this.display = (canvas, coord) => {
        for (let animation of this.animations) {
            if (animation.done) {
                animation.display(canvas, coord)
            } else {
                animation.display(canvas, coord);
                break;
            }
        }
    }
}

export {
    Create, Chain, FadeIn, FadeOut
}