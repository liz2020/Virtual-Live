<template>
  <div class="dropdown">
    <button @click="expandDropdown" class="dropbtn">{{ title }}</button>
    <div ref="dropdownList" class="dropdown-content">
      <div @click="setTitleAndLang('zhCN')">简体中文</div>
      <div @click="setTitleAndLang('enUS')">English</div>
    </div>
  </div>
</template>

<script>
import { debounce } from "@/utill";
export default {
  props: ["initLocale", "onClick"],
  data: function() {
    return {
      title: undefined
    };
  },
  created() {
    window.addEventListener("click", debounce(this.hideDropdown, 100));
  },
  destroyed() {
    window.removeEventListener("click", this.hideDropdown);
  },
  mounted: function() {
    this.title = this.initLocale == "zhCN" ? "简体中文" : "English";
  },
  methods: {
    setTitleAndLang(locale) {
      this.title = locale == "zhCN" ? "简体中文" : "English";
      this.onClick(locale);
    },
    expandDropdown() {
      this.$refs["dropdownList"].classList.toggle("show");
    },
    hideDropdown(event) {
      if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }
      }
    }
  }
};
</script>

<style scoped>
/* https://www.w3schools.com/howto/howto_js_dropdown.asp */
/* Dropdown Button */
.dropbtn {
  background-color: #3498db;
  color: white;
  width: 100%;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: #2980b9;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  margin-top: 5px;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display: block;
}
</style>
