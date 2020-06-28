<template>
  <div>
    <span>{{ title }}</span>
    <input
      class="range"
      v-model="sliderValue"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      @input="onInputMethod(sliderValue)"
    />
    <input
      class="number"
      v-model="sliderValue"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      @input="onInputMethod(sliderValue)"
    />
  </div>
</template>

<script>
import { UserConfig } from "@/config";
export default {
  name: "RangeSlider",
  props: ["title", "default", "min", "max", "step", "onInputMethod"],
  data: function() {
    return {
      sliderValue: UserConfig.getInstance().get(this.title) || this.default
    };
  },
  computed: {
    onParamUpdate: function() {
      return this.$store.state.storeParam.onParamUpdate;
    },
    onParamReset: function() {
      return this.$store.state.storeParam.onParamReset;
    }
  },
  watch: {
    onParamUpdate: function() {
      UserConfig.getInstance().set(this.title, this.sliderValue);
    },
    onParamReset: function() {
      this.sliderValue =
        UserConfig.getInstance().get(this.title) || this.default;
      this.onInputMethod(this.sliderValue);
    }
  }
};
</script>

<style scoped>
div {
  display: flex;
  margin: 1px;
}
span {
  width: 40%;
  margin-top: 1%;
  margin-right: 1%;
  padding-left: 5px;
  background-color: #f1f1f1;
  font-size: 1em;
}
.range {
  width: 45%;
}
.number {
  width: 13%;
  margin: 1%;
}
</style>
