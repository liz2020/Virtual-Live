<template>
  <div>
    <input
      v-model="scale"
      type="range"
      min="0.5"
      max="5"
      step="0.1"
      v-on:input="setScale"
    />
    <input
      v-model="pos_x"
      type="range"
      min="-1.5"
      max="1.5"
      step="0.01"
      v-on:input="setX"
    />
    <input
      v-model="pos_y"
      type="range"
      :min="-2 * scale"
      :max="2 * scale"
      step="0.01"
      v-on:input="setY"
    />
  </div>
</template>

<script>
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
export default {
  name: "ControlPanel",
  data: function() {
    return {
      scale: 1.0,
      pos_x: 0,
      pos_y: 0
    };
  },
  methods: {
    setScale() {
      LAppDelegate.getInstance().setL2D_Scale(this.scale);
    },
    setX() {
      LAppDelegate.getInstance().setL2D_X(this.pos_x);
    },
    setY() {
      LAppDelegate.getInstance().setL2D_Y(this.pos_y);
    }
  }
};
</script>

<style></style>
