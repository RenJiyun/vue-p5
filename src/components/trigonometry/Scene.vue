<template>
  <div id="canvas"></div>
</template>

<script>
const $math = require("mathjs");
import P5 from "p5";
import { Coord } from "@/lib/Coord";
import { Circle } from "@/lib/Mobj";
import { Scene } from "@/lib/Scene";
import { Create } from "@/lib/Animation";

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
        width: this.scene.width,
        height: this.scene.height,
        xInterval: 20,
        grid: false,
        labelInterval: 2,
      };

      let coord = new Coord(coordConfig);

      this.scene
        .add(coord)
        .add(new Create(new Circle(coord, $math.complex(0, 0), 10), 2000))
        .add(new Create(new Circle(coord, $math.complex(0, 0), 5), 2000));
    },

    draw() {
      this.scene.show();
    },
  },
};
</script>
