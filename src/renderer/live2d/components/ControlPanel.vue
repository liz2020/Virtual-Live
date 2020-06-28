<template>
  <div id="ControlPanelContainer">
    <div class="top scroll">
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
      <ColorPicker></ColorPicker>
      <div class="flexContainer">
        <button class="btn resetBtn" v-on:click="reset">
          {{ $t("message")["live2d.components.ControlPanel.reset"] }}
        </button>
        <button class="btn saveBtn" v-on:click="save">
          {{ $t("message")["live2d.components.ControlPanel.save"] }}
        </button>
      </div>
    </div>
    <div class="bottom">
      <FaceDetection />
    </div>
  </div>
</template>

<script>
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
import ModelSelector from "@live2d/components/ModelSelector";
import RangeSlider from "@live2d/components/RangeSlider";
import ColorPicker from "@live2d/components/ColorPicker";
import FaceDetection from "@live2d/components/FaceDetection";
export default {
  name: "ControlPanel",
  components: { ModelSelector, RangeSlider, ColorPicker, FaceDetection },
  computed: {
    modelDisplayOps: function() {
      return [
        {
          title: this.$t("message")["live2d.components.ControlPanel.scale"],
          default: 1.5,
          min: 0.5,
          max: 2.5,
          step: 0.1,
          onInputMethod: this.setScale
        },
        {
          title: this.$t("message")["live2d.components.ControlPanel.x_axis"],
          default: 0,
          min: -3,
          max: 3,
          step: 0.01,
          onInputMethod: this.setX
        },
        {
          title: this.$t("message")["live2d.components.ControlPanel.y_axis"],
          default: 0,
          min: -5,
          max: 5,
          step: 0.01,
          onInputMethod: this.setY
        }
      ];
    }
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
      this.$store.dispatch("resetParamByGroup", "all");
    },
    save() {
      this.$store.dispatch("storeParamByGroup", "all");
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
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top {
  margin-left: 5px;
  margin-top: 5px;
  flex: 1 1 auto; /*[ <‘flex-grow’> <‘flex-shrink’>? || <‘flex-basis’> ] */
}

.bottom {
  flex-shrink: 0;
  margin-bottom: 0;
}

.scroll {
  overflow-x: hidden;
  overflow-y: scroll;
}

.btn {
  font-size: 16px;
  border: none;
  cursor: pointer;
  margin-right: 1%;
}

.resetBtn {
  width: 20%;
  color: #fff;
  background-color: rgb(223, 76, 76);
}

.saveBtn {
  width: 80%;
  color: #fff;
  background-color: #4fc08d;
}

.flexContainer {
  margin-top: 5px;
  display: flex;
}
</style>
