
// 创建动画
function Create(mobj, duration = 6000) {
    this.mobj = mobj;
    this.done = false;
    this.duration = duration;
    this.current = 0;

    this.display = (canvas) => {
        this.current += Math.ceil(canvas.deltaTime)
        if (!this.done) {
            let pg = canvas.createGraphics(canvas.width, canvas.height);
            pg.translate(pg.width / 2, pg.height / 2);
            pg.background(0, 0);
            this.mobj.show(pg)
            canvas.scale(canvas.map(this.current, 1, this.duration, 0, 1))
            canvas.image(pg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            if (this.current >= this.duration) {
                this.done = true;
            }
        } else {
            canvas.scale(1);
            this.mobj.show(canvas);
        }
    }
}


// 串联动画
function Chain(animations = []) {
    this.animations = animations;

    this.display = (canvas) => {
        for (let animation of this.animations) {
            if (animation.done) {
                animation.display(canvas)
            } else {
                animation.display(canvas);
                break;
            }
        }
    }
}

export {
    Create, Chain
}