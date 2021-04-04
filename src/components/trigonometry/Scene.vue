<template>
  <div id="canvas"></div>
</template>

<script>
const $math = require("mathjs");
import P5 from "p5";
import { Coord } from "@/lib/Coord";
import { Scene } from "@/lib/Scene";
import {
  VetorField,
  Vector,
  PerlinNosieField,
  Partical,
  Line,
} from "@/series/trigonometry/c1/mobjs";

import { Function } from "@/lib/Mobj";

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

      this.scene.add(
        new VetorField(coord, (c, t) => {
          return c.mul(
            $math.complex({ r: 1 / c.abs(), phi: $math.pi / 2 + t / 1000 })
          );
        })
      );

      this.scene.add(
        new Vector(coord, $math.complex(0, 1), $math.complex(10, 2))
      );
      this.scene.pop();
      this.scene.pop();
      this.scene.add(new PerlinNosieField(coord));
      this.scene.pop();

      // this.scene.add(new Function(coord, (x) => $math.sin(x)));
      // this.scene.pop();

      this.scene.add(new Function(coord, (x) => $math.cos((x * x) / 50)));
      this.scene.pop();

      this.scene.add(
        new Partical(coord, $math.complex(0, 0), $math.complex(3, 2))
      );

      this.scene.add(
        new Line(coord, $math.complex(0, 8), $math.complex(22, 0))
      );
    },

    draw() {
      this.scene.show();
    },
  },
};

// TODO 粒子在场中的运动；粒子的尾迹； 柏林噪声场中粒子的运动；椭圆的性质；手拉手模型
</script>
