<template>
  <div>
    <div class="wrapper">
      <div class="title">
        {{ $t("message")["live2d.components.ColorPicker.color"] }}
      </div>
      <div class="green" @click="changeColor(green)"></div>
      <div class="blue" @click="changeColor(blue)"></div>
      <button class="customColor" @click="togglePicker">
        {{ pickerDescription }}
      </button>
    </div>
    <div
      clreass="picker"
      ref="picker"
      acp-color="#EFE9E7"
      acp-show-hsl="no"
      acp-sl-bar-size="276,190"
    ></div>
  </div>
</template>

<script>
import { LAppDelegate } from "@live2d/lapp/lappdelegate";
const AColorPicker = require("a-color-picker");
export default {
  name: "ColorPicker",
  data: function() {
    return {
      green: [0, 177, 64],
      blue: [0, 71, 187],
      colorPicker: undefined,
      hidePicker: true
    };
  },
  computed: {
    pickerDescription: function() {
      return this.hidePicker
        ? this.$t("message")["live2d.components.ColorPicker.expand"]
        : this.$t("message")["live2d.components.ColorPicker.close"];
    }
  },
  mounted: function() {
    this.colorPicker = AColorPicker.createPicker(this.$refs["picker"]);
    this.colorPicker.on("change", (picker, color) => {
      this.parseAndChangeColor(color);
    });
    this.colorPicker.toggle();
    this.description = this.expand;
  },
  methods: {
    changeColor(color255) {
      let normalizedColor = [0.0, 0.0, 0.0];
      for (var i = 0; i < color255.length; i++) {
        normalizedColor[i] = color255[i] / 255.0;
      }
      LAppDelegate.getInstance().setBackgroundColor(normalizedColor);
    },
    parseAndChangeColor(colorPickerOutput) {
      this.changeColor(AColorPicker.parseColor(colorPickerOutput, "rgb"));
    },
    togglePicker() {
      this.colorPicker.toggle();
      this.hidePicker = !this.hidePicker;
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
.picker {
  width: 100%;
}
.title {
  width: 41%;
  margin-top: 1%;
  margin-right: 1%;
  padding-left: 5px;
  background-color: #f1f1f1;
  font-size: 1em;
}
.green {
  background-color: #00b140;
  width: 20%;
  margin: 1% 1% 1% 0;
}
.blue {
  background-color: #0047bb;
  width: 20%;
  margin: 1% 1% 1% 0;
}
.customColor {
  width: 20%;
  margin: 1% 2% 1% 0;
}
</style>
