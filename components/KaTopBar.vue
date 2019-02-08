<template>
  <div class="ka-topbar"
  >
    <div class="ka-row-flex">
      <div class="vertically-center icon-div">
        <img class="ka-icon" @click="$emit('menu', true)" src="../assets/icons/menu.svg" alt="">
      </div>
      <div class="vertically-center pointer" @click="$emit('search', true)">
        Spread Kindness with Technology
      </div>
      <div class="vertically-center icon-div">
        <img class="ka-icon" @click="$emit('search', true)" src="../assets/icons/search.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
@import url('./ka-topbar.css');
</style>
