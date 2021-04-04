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
// const $bazier = require("bezier-easing");

export default {
  mounted() {
    const script = (p5) => {
      (p5.setup = () => {
        this.setup(p5);
      }),
        (p5.draw = () => {
          this.draw();
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
        width: this.scene.width * 0.8,
        height: this.scene.height * 0.8,
        xInterval: 20,
        grid: false,
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
        (c) => $math.complex({ r: 1, phi: $math.pi / 2 + c.arg() }),
        {
          coord: coord,
        }
      );

      let partical = new Partical($math.complex(0, 6), $math.complex(0, 0), {
        coord: coord,
      });

      // let particals = [];
      // for (let i = 0; i < 100; i++) {
      //   let s = $math.complex()
      //   new Partical($math.complex())
      // }

      // partical.addToVf(vf2.add(vf1))

      this.scene.add(vf2.add(vf1)).add(partical);
    },

    draw() {
      this.scene.show();
    },
  },
};

// TODO 柏林噪声场中粒子的运动；椭圆的性质；手拉手模型
// TODO 精度问题，比如椭圆中粒子的碰撞可能会出去
// TODO 数学对象临时动画的加入
</script>
