<template>
  <div id="canvas"></div>
</template>

<script>
// 圆的反演

import P5 from "p5";
const $math = require("mathjs");
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
      p5.background(0);
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      let coordConfig = {
        ox: 0,
        oy: 0,
        width: 800,
        height: 600,
        xInterval: 1,
        grid: false,
        labelInterval: 100,
      };
      let coord = new CoordinateSystem(coordConfig);
      coord.show(p5);

      p5.noFill();
      p5.stroke(255);
      let r = 150;
      p5.circle(0, 0, 2 * r * coordConfig.xInterval);

      

      p5.noFill();
      let points = coord.circularMotion(p5, -100, 50, 50);
      let complexes = []
      for (let p of points) {
        let c = $math.complex(p.x, p.y);
        complexes.push($math.complex({ r: (r * r) / c.abs(), phi: c.arg() }));
      }

      coord.shape(p5, complexes);
    },
  },
};
</script>
