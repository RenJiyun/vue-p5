<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";

const $math = require("mathjs");

import { CoordinateSystem } from "@/lib/CoordinateSystem";
import { Circle, Function, Triangle } from "@/lib/Mobj";
import { Create, Chain } from "@/lib/Animation";
import { RollingCircle } from "@/lib/RollingCircle";

export default {
  mounted() {
    const script = (p5) => {
      (p5.setup = () => {
        this.setup(p5);
      }),
        (p5.draw = () => {
          this.draw(p5);
        }),
        (p5.keyPressed = () => {
          this.keyPressed(p5);
        }),
        (p5.mouseWheel = (e) => {
          this.mouseWheel(p5, e);
        });
    };
    new P5(script, "canvas");
  },

  data() {
    return {
      coord: null,
      scale: 5000,
    };
  },

  methods: {
    setup(p5) {
      p5.createCanvas(1280, 720);
      let coordConfig = {
        defaultCanvas: p5,
        ox: 0,
        oy: 0,
        width: p5.width,
        height: p5.height,
        xInterval: 20,
        grid: false,
        labelInterval: 2,
      };
      this.coord = new CoordinateSystem(coordConfig);
      this.circle = new Circle(0, 0, 10);
      this.f = new Function((x) => x * x);
      this.triangle = new Triangle(-6, 0, 0, 6, 4, 0);

      this.rollingCircle1 = new RollingCircle(1, 2, (l) => {
        return {
          c: $math.complex(l, 0),
          nc: $math.complex(0, 1),
        };
      });

      this.rollingCircle2 = new RollingCircle(2, 2, (l) => {
        return {
          c: $math.complex({ r: l, phi: $math.pi / 4 }),
          nc: $math.complex({ r: 1, phi: ($math.pi * 3) / 4 }),
        };
      });

      this.rollingCircle3 = new RollingCircle(10, 6, () => {
        return {
          c: $math.complex(-5, 0),
          nc: $math.complex(0, 0),
        };
      });

      this.animationChain = new Chain([
        new Create(this.coord, 500),
        new Create(this.circle, 500),
        new Create(this.f, 500),
        new Create(this.triangle, 500),
        new Create(this.rollingCircle1, 500),
        new Create(this.rollingCircle2, 5000),
      ]);
    },

    draw(p5) {
      p5.background(0);
      p5.translate(p5.width / 2, p5.height / 2);
      // this.coord.show();
      this.animationChain.display(p5, this.coord)
      // this.coord.showMobj(p5, this.rollingCircle3);
    },

    keyPressed(p5) {
      if (p5.keyCode == 71) {
        this.coord.grid = !this.coord.grid;
      }
    },

    mouseWheel(p5, e) {
      let delta = e.delta;
      this.scale = this.scale - delta
      if (this.scale >= 5000) {
        this.scale = 5000;
      }

      if (this.scale <= 2500) {
        this.scale = 2500
      }
      this.coord.scale = this.scale / 5000;
      console.log(this.coord.scale)
    }
  },
};
</script>
