<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
export default {
  mounted() {
    const script = (p5) => {
      (p5.setup = () => {
        this.setup(p5);
      }),
        (p5.draw = () => {
          this.draw(p5);
        });
    };
    new P5(script, "canvas");
  },
  data() {
    return {
      points: [],
      theta: 0,

      // 时间
      t: 0,
    };
  },
  methods: {
    setup(p5) {
      p5.createCanvas(800, 600);
      p5.background(0);
    },

    draw(p5) {
      this.generalCircleMotion(p5);
    },

    // 一般化，由若干个不同频率的三角函数组成，圆上的圆上的圆上的...运动
    generalCircleMotion(p5) {
      p5.translate(p5.width / 2, p5.height / 2);
      let t = this.t;
      let x = (p5.cos(t) + p5.cos(6 * t) / 2 + p5.sin(14 * t)) * 100;
      let y = (p5.sin(t) + p5.sin(6 * t) / 2 + p5.cos(14 * t)) * 100;
      p5.fill(255, 0, 0);
      p5.noStroke();
      p5.circle(x, y, 2);
      this.t += 0.01;
    },

    // 圆在圆上的运动
    circleOnCircle(p5) {
      // p5.background(0);

      p5.translate(p5.width / 2, p5.height / 2);
      p5.noFill();
      p5.stroke(255);
      let r1 = 100;
      p5.circle(0, 0, 2 * r1);

      let r2 = 50;

      // let ox = p5.cos(p5.radians(p5.frameCount)) * (r1 + r2);
      // let oy = -p5.sin(p5.radians(p5.frameCount)) * (r1 + r2);
      // p5.circle(ox, oy, 2 * r2);

      p5.fill(255, 0, 0);
      p5.noStroke();
      let x =
        p5.cos(this.theta) * (r1 + r2) -
        p5.cos(2 * (r1 / r2) * this.theta) * r2;
      let y =
        -p5.sin(this.theta) * (r1 + r2) +
        p5.sin(2 * (r1 / r2) * this.theta) * r2;
      p5.circle(x, y, 5);

      // 会越画越慢
      // this.points.push({
      //   x: x,
      //   y: y,
      // });

      p5.noFill();
      p5.stroke(255);
      p5.beginShape();
      for (let p of this.points) {
        p5.vertex(p.x, p.y);
      }

      p5.endShape();
      this.theta += 0.05;
    },

    // 点在圆上运动
    pointOnCircle(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      p5.noFill();
      p5.stroke(255);
      let r = 100;
      p5.circle(0, 0, 2 * r);

      let x = p5.cos(p5.radians(p5.frameCount)) * r;
      let y = -p5.sin(p5.radians(p5.frameCount)) * r;
      p5.fill(255);
      p5.circle(x, y, 10);
      p5.fill(255, 0, 0);
      p5.circle(x, 0, 10);

      p5.fill(0, 0, 255);
      p5.circle(0, y, 10);

      p5.fill(0, 255, 0);
      p5.circle(x / 2, y / 2, 10);

      p5.line(x, y, x, 0);
      p5.line(x, y, 0, y);
    },
  },
};
</script>
