<template>
  <div id="canvas"></div>
</template>
<script>
import * as p5 from "p5";

import * as stage from "@/lib/stage";
import * as mm from "@/lib/mode_manager";

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
    return {
      // 舞台
      stage: null,
    };
  },

  methods: {
    setup(p5) {
      mm.init(p5);
      stage.init(p5, 1400, 700);
      this.stage = stage;

      stage.createScene(-250, -100, 200, 200);
      // stage.createScene(30, 50, 300, 200);
      // stage.createScene(100, 100, 400, 200);  
    },

    draw(p5) {
      this.stage.draw();
      p5.noLoop();
    },
  },
};
</script>
