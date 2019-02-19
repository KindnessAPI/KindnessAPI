<template>
  <div class="full mounter" :class="{ fadeIn: ready }" ref="insert">
  </div>
</template>

<script>
export default {
  data () {
    return {
      home: false,
      ready: false
    }
  },
  mounted () {
    import('../gl/audio/index.js').then((home) => {
      this.home = home
      home.setup({ dom: this.$refs['insert'] })
      this.$nextTick(() => {
        this.ready = true
        this.$emit('ready', true)
        this.$emit('api', home)
      })
    })
  },
  beforeDestroy () {
    this.home.clean()
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
