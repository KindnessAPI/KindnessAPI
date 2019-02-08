<template>
  <div class="ka-aside">
    <div class="ka-search-overlay" :class="{ 'ka-search-open': search }">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    search: {
      default: false
    }
  }
}
</script>

<style scoped>
.ka-search-overlay{
  position: absolute;
  top: 0px;
  right: 0%;

  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  transform: translateX(100%);
}

.ka-search-overlay.ka-search-open{
  transform: translateX(0);
}

</style>
