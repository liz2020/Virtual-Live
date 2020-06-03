<template>
  <canvas ref="ChromaKey">Chromakey</canvas>
</template>

<script lang="ts">
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
import { debounce } from "@/utill";
export default {
  name: "ChromaKey",
  data: function() {
    return {
      canvas: undefined
    };
  },
  created() {
    window.addEventListener("resize", debounce(this.HandleWindowResize, 500));
  },
  destroyed() {
    window.removeEventListener("resize", this.HandleWindowResize);
  },
  mounted: function() {
    this.canvas = this.$refs["ChromaKey"];

    /**
     * ブラウザロード後の処理
     */
    window.onload = (): void => {
      // create the application instance
      if (LAppDelegate.getInstance().initialize(this.canvas) == false) {
        return;
      }

      LAppDelegate.getInstance().run();
    };

    /**
     * 終了時の処理
     */
    window.onbeforeunload = (): void => LAppDelegate.releaseInstance();
  },
  methods: {
    HandleWindowResize() {
      if (!this.canvas) {
        this.canvas = this.$refs["ChromaKey"];
      }
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      LAppDelegate.getInstance().onWindowResize();
    }
  }
};
</script>

<style scoped>
canvas {
  height: 100%;
  width: 100%;
}
</style>
