<template>
  <div id="canvas"></div>
</template>

<script>
// 圆的反演

import P5 from "p5";
// const $math = require("mathjs");
import { CoordinateSystem } from "./CoordinateSystem";

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
  methods: {
    setup(p5) {
      p5.createCanvas(1000, 700);
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      let coord = new CoordinateSystem({
        ox: 0,
        oy: 0,
        width: 800,
        height: 600,
        xInterval: 10,
        grid: false,
        labelInterval: 5,
      });
      coord.show(p5);



    },
  },
};
</script>
