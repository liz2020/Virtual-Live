<template>
  <div id="ControlPanelContainer" class="scroll">
    <ModelSelector></ModelSelector>
    <RangeSlider
      v-for="modelDisplay in modelDisplayOps"
      :key="modelDisplay.title"
      :title="modelDisplay.title"
      :default="modelDisplay.default"
      :min="modelDisplay.min"
      :max="modelDisplay.max"
      :step="modelDisplay.step"
      :onInputMethod="modelDisplay.onInputMethod"
    ></RangeSlider>
    <button v-on:click="reset">重置</button>
  </div>
</template>

<script>
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
import ModelSelector from "@live2d/components/ModelSelector";
import RangeSlider from "@live2d/components/RangeSlider";
export default {
  name: "ControlPanel",
  components: { ModelSelector, RangeSlider },
  data: function() {
    return {
      modelDisplayOps: [
        {
          title: "scale",
          default: 1.5,
          min: 0.5,
          max: 5,
          step: 0.1,
          onInputMethod: this.setScale
        },
        {
          title: "x axis",
          default: 0,
          min: -3,
          max: 3,
          step: 0.01,
          onInputMethod: this.setX
        },
        {
          title: "y axis",
          default: 0,
          min: -5,
          max: 5,
          step: 0.01,
          onInputMethod: this.setY
        }
      ]
    };
  },
  mounted: function() {
    this.reset();
  },
  methods: {
    setScale(scale) {
      LAppDelegate.getInstance().setL2D_Scale(scale);
    },
    setX(pos_x) {
      LAppDelegate.getInstance().setL2D_X(pos_x);
    },
    setY(pos_y) {
      LAppDelegate.getInstance().setL2D_Y(pos_y);
    },
    reset() {
      this.$emit("reset");
    }
  }
};
</script>

<style>
#ControlPanelContainer {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  margin-left: 5px;
  margin-top: 5px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll {
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
