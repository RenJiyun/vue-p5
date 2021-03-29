<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
import { CoordinateSystem } from "./CoordinateSystem";
import { Create, Chain } from "./Animation";
import { Circle } from "./Mobj";
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
    return {};
  },

  methods: {
    setup(p5) {
      p5.createCanvas(1000, 700);
      p5.frameRate(30);

      let coordConfig = {
        ox: 0,
        oy: 0,
        width: 800,
        height: 600,
        xInterval: 40,
        grid: false,
        labelInterval: 2,
      };
      let coord = new CoordinateSystem(coordConfig);
      this.animationInstance1 = new Create(coord, 500);

      let circle = new Circle(0, 0, 300);
      this.animationInstance2 = new Create(circle, 600);


      this.animationInstance3 = new Chain([this.animationInstance1, this.animationInstance2])
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      this.animationInstance3.display(p5);
    },
  },
};
</script>
