
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
}

export {
    Circle
}
