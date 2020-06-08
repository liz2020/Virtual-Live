<template>
  <div id="wrapper">
    <div class="left"><ControlPanel /></div>
    <div class="right"><ChromaKey /></div>
  </div>
</template>

<script>
import ChromaKey from "@live2d/components/ChromaKey";
import ControlPanel from "@live2d/components/ControlPanel";
import { ipcRenderer } from "electron";

export default {
  name: "live2d",
  components: { ChromaKey, ControlPanel },
  mounted: function() {
    ipcRenderer.on("setLanguage", (event, locale) => {
      this.$i18n.locale = locale;
    });
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html,
body,
#wrapper {
  width: 100%;
  height: 100%;
}

.left {
  width: 300px;
}

.right {
  position: absolute;
  top: 0;
  left: 300px;
  right: 0;
  height: 100%;
}
</style>
