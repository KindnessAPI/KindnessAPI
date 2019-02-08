<template>
  <div class="full mounter" :class="{ fadeIn: ready }" ref="insert">
  </div>
</template>

<script>
export default {
  data () {
    return {
      ready: false
    }
  },
  mounted () {
    import('../gl/home/index.js').then((home) => {
      home.setup({ dom: this.$refs['insert'] })
      this.$nextTick(() => {
        this.ready = true
        this.$emit('ready', true)
      })
    })
  }
}
</script>

<style scoped>
.mounter{
  opacity: 0;
  transition: opacity 1s;
}
.fadeIn.mounter{
  opacity: 1;
}
.center-text{
  text-align: center;
  display: flex;
  align-items: center;
}
</style>
