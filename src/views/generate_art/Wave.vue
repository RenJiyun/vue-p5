<template>
  <div id="canvas"></div>
</template>

<script>
import * as p5 from "p5";
import Coord from "@/lib/Coord";
import Scene from "@/lib/Scene";
import Wave from "@/lib/art/Wave";

export default {
  mounted() {
    const script = (_) => {
      (_.setup = () => {
        this.setup(_);
      }),
        (_.draw = () => {
          this.draw(_);
        });
    };

    new p5(script, "canvas");
  },

  data() {
    return {};
  },

  methods: {
    setup(p5) {
      let sceneConfig = {
        p5: p5,
        width: 1280,
        height: 720,
      };

      this.scene = new Scene(sceneConfig);

      let coordConfig = {
        ox: 0,
        oy: 0,
        width: this.scene.width,
        height: this.scene.height,
        xInterval: 20,
        yInterval: 20,
        grid: true,
        label: true,
        labelInterval: 3,
        display: false,
      };

      let coord = new Coord(
        coordConfig,
        {},
        {},
        {
          p5: p5,
        }
      );

      this.scene.add(coord.create());
      this.scene.add(new Wave(p5, coord));
    },

    draw(p5) {
      this.scene.show();
    },
  },
};
</script>
