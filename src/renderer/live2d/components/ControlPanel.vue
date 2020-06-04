<template>
  <div id="ControlPanelContainer" class="scroll">
    <ModelSelector></ModelSelector>
    <input
      v-model="scale"
      type="range"
      min="0.5"
      max="5"
      step="0.1"
      @input="setScale"
    />
    <input
      v-model="pos_x"
      type="range"
      min="-3"
      max="3"
      step="0.01"
      @input="setX"
    />
    <input
      v-model="pos_y"
      type="range"
      min="-5"
      max="5"
      step="0.01"
      @input="setY"
    />
    <button v-on:click="reset">重置</button>
  </div>
</template>

<script>
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
import ModelSelector from "@live2d/components/ModelSelector";
export default {
  name: "ControlPanel",
  components: { ModelSelector },
  data: function() {
    return {
      scale: 1.3,
      pos_x: 0,
      pos_y: 0
    };
  },
  mounted: function() {
    this.reset();
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
    },
    reset() {
      this.scale = 1.3;
      this.pos_x = 0;
      this.pos_y = 0;
      this.setScale();
      this.setX();
      this.setY();
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
