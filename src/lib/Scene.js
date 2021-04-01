
import { Animation } from "./Animation"

class Scene {
    constructor(config) {
        let { canvas, width, height } = config;
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.canvas.createCanvas(this.width, this.height);
        this.objects = [];

        // 每个对象均绘制在私有的图层上，场景由图层叠加形成
        this.snapshots = [];

        this.done = false;
    }

    show() {
        function updateSnapshots() {
            for (let index = 0; index < this.objects.length; index++) {
                let obj = this.objects[index];
                let snapshot = this.snapshots[index];
                if (!obj.done) {
                    obj.show(snapshot);
                } else if (obj instanceof Animation) {
                    this.objects[index] = obj.obj;
                }
            }
        }

        function showSnapshots() {
            for (let snapshot of this.snapshots) {
                this.canvas.image(snapshot, -this.width / 2, -this.height / 2, this.width, this.height);
            }
        }


        this.canvas.background(0);
        this.canvas.translate(this.width / 2, this.height / 2)
        updateSnapshots.call(this);
        showSnapshots.call(this);
        if (this.done) {
            this.canvas.noLoop();
        }

    }


    add(obj) {
        this.objects.push(obj);
        let pg = this.canvas.createGraphics(this.width, this.height);
        pg.background(0, 0, 0, 0);
        pg.translate(this.width / 2, this.height / 2);
        this.snapshots.push(pg);

        return this;
    }

}

export {
    Scene
}