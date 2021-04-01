/**
 * 动画效果分成两种：创建和其他
 * 创建效果需要对象自己完成
 */
class Animation {
    constructor(obj, duration = 300) {
        this._obj = obj;

        // 动画总时长
        this.duration = duration;
        this.current = 0;
        this._done = false;
    }

    get done() {
        return this._done;
    }

}


class Create extends Animation {
    constructor(...args) {
        super(...args);
    }

    show(canvas) {
        let ret = []
        if (!this._done) {
            this.current += Math.ceil(canvas.deltaTime);
            this.current = Math.min(this.current, this.duration);
            // 此外可以对current施加别的函数，例如贝塞尔函数
            let progress = this.current / this.duration;
            this.obj.create(canvas, progress);

            // TODO 这些地方可能会出现精度的问题
            if (progress >= 1) {
                this._done = true;
                ret.push(this.obj);
            }
        }
        return ret;
    }
}

class FadeIn extends Animation {

}

class FadeOut extends Animation {

}



class Sequential extends Animation {
    constructor(animations) {
        super();
        this.animations = animations;
    }

    show(canvas) {
        for (let animation of this.animations) {
            if (!animation.done) {
                let lastObj = animation.show(canvas);
                return lastObj;
            }
        }
        this._done = true;
    }
}

class Parallel extends Animation {
    constructor(animations) {
        super();
        this.animations = animations;
    }
}

export {
    Animation, Create, Sequential, FadeIn, FadeOut, Parallel
}