<template>
  <div class="wrapper">
    <div class="title">{{ title }}</div>
    <div class="green" @click="changeColor(green)"></div>
    <div class="blue" @click="changeColor(blue)"></div>
  </div>
</template>

<script>
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
export default {
  name: "ColorPicker",
  data: function() {
    return {
      title: "color",
      green: [0, 177 / 255.0, 64 / 255.0],
      blue: [0, 71 / 255.0, 187 / 255.0]
    };
  },
  methods: {
    changeColor(newColor) {
      LAppDelegate.getInstance().setBackgroundColor(newColor);
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  margin: 1px;
  width: 100%;
}
.title {
  width: 40%;
  margin-top: 1%;
  margin-right: 1%;
  padding-left: 5px;
  background-color: #f1f1f1;
  font-size: 1em;
}
.green {
  background-color: #00b140;
  width: 30%;
  margin: 1% 0 1% 0;
}
.blue {
  background-color: #0047bb;
  width: 30%;
  margin: 1% 2% 1% 1%;
}
</style>
