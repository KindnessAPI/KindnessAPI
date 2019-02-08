<template>
  <div class="ka-aside" :class="{ 'ka-menu-open': menu }">
    <div class="ka-overlay" @click="$emit('menu', false)">
      1243
    </div>
    <div class="ka-menu">
      1243
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menu: {
      default: false
    }
  }
}
</script>

<style scoped>
.ka-menu{
  position: absolute;
  top: 0px;
  left: -256px;
  width: 256px;
  height: calc(100%);

  background-color: white;
  border: #e0e0e0 solid 1px;
  border-left: 0px;
  box-sizing: border-box;
  border-top: 0px;
  border-bottom: 0px;
}
.ka-overlay{
  position: absolute;
  top: 0px;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.192);
}

.ka-menu,
.ka-overlay{
  transition: transform 1s 0s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}

.ka-menu-open.ka-aside .ka-menu{
  transition: transform 1s 0s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: translateX(100%);
}
.ka-menu-open.ka-aside .ka-overlay{
  transition: transform 1s 0s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: translateX(100%);
}

</style>
