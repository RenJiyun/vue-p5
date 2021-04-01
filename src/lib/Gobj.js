class Circle {
    constructor(x0, y0, r) {
        this.x0 = x0;
        this.y0 = y0;
        this.r = r;

        this._done = false;
    }

    get done() {
        return this._done;
    }

    show(canvas) {
        canvas.noFill();
        canvas.stroke(255);
        canvas.circle(this.x0, this.y0, this.r * 2);

        this._done = true;
    }


}

export {
    Circle
}