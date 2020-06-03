<template>
  <div id="wrapper">
    <div class="left"><ControlPanel /></div>
    <div class="right"><ChromaKey /></div>
  </div>
</template>

<script>
import ChromaKey from "@live2d/components/ChromaKey";
import ControlPanel from "@live2d/components/ControlPanel";
export default {
  name: "live2d",
  components: { ChromaKey, ControlPanel }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
}

.left {
  width: 220px;
  height: 100%;
}
.right {
  position: absolute;
  top: 0;
  left: 220px;
  right: 0;
  height: 100%;
}
</style>
