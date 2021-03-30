<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
import { CoordinateSystem } from "@/lib/CoordinateSystem";
import { Create, Chain } from "@/lib/Animation";
import { Circle } from "@/lib/Mobj";
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
      let circle = new Circle(0, 0, 300);
      this.animations = new Chain([new Create(coord, 500), new Create(circle, 600)])
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      this.animations.display(p5);
    },
  },
};
</script>
