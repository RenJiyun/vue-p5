<template>
  <div id="canvas"></div>
</template>

<script>
const $math = require("mathjs");
import P5 from "p5";
import { Coord } from "@/lib/Coord";
import { Scene } from "@/lib/Scene";
// import { Partical, Line, Ellipse } from "@/series/trigonometry/c1/mobjs";

import { VetorField, Partical } from "@/lib/Mobj";
import { Text } from "@/lib/Text";
// const $bazier = require("bezier-easing");

// TODO 暂时可以用手写代替
import katex from "katex";

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
      coord: null,
      scale: 5000,
    };
  },

  methods: {
    setup(p5) {
      // 场景配置
      let sceneConfig = {
        canvas: p5,
        width: 1280,
        height: 720,
      };
      this.scene = new Scene(sceneConfig);

      // 添加场景中的对象
      let coordConfig = {
        defaultCanvas: p5,
        ox: 0,
        oy: 0,
        width: this.scene.width * 0.5,
        height: this.scene.height * 0.5,
        xInterval: 20,
        grid: true,
        labelInterval: 2,
      };

      let coord = new Coord(coordConfig);
      this.scene.add(coord);

      let vf1 = new VetorField(
        (c) => {
          let noise = p5.noise(c.re, c.im);
          return $math.complex({ r: 1, phi: 2 * $math.pi * noise });
        },
        {
          coord: coord,
        }
      );

      let vf2 = new VetorField(
        (c, t) =>
          $math.complex({ r: 1, phi: $math.pi / 2 + c.arg() + t / 2000 }),
        {
          coord: coord,
        }
      );

      let partical = new Partical($math.complex(0, 6), $math.complex(0, 0), {
        coord: coord,
      });

      partical.addToVf(vf2.add(vf1));

      this.scene.add(new Text());

      // this.scene.add(vf2.add(vf1));
    },

    draw() {
      this.scene.show();
    },
  },
};

// TODO 坐标系的整体形变
</script>
