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
export default {
  name: "RangeSlider",
  props: ["title", "default", "min", "max", "step", "onInputMethod"],
  data: function() {
    return {
      sliderValue: this.default
    };
  },
  created: function() {
    this.$parent.$on("reset", this.reset);
  },
  methods: {
    reset() {
      this.sliderValue = this.default;
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
  margin: 1%;
  background-color: #f1f1f1;
}
.range {
  width: 45%;
}
.number {
  width: 13%;
  margin: 1%;
}
</style>
