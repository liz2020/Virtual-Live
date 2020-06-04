<template>
  <a @click="responseMethod(index)">{{ model }}</a>
</template>

<script>
export default {
  name: "dropDownItem",
  props: ["model", "index", "responseMethod"]
};
</script>

<style></style>
