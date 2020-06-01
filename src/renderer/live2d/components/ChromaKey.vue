<template>
  <div>
    <canvas ref="ChromaKey">Chromakey</canvas>
  </div>
</template>

<script lang="ts">
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
export default {
  name: "ChromaKey",
  data: function() {
    return {
      canvas: undefined
    };
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
  methods: {}
};
</script>

<style></style>
