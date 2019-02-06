<template>
  <mu-container>

  </mu-container>
</template>

<script>
export default {
  layout: 'panel',
  components: {
  },
  beforeCreate () {
    this.$parent.$emit('title', 'blogs')
  }
}
</script>

<style lang="less">

</style>
