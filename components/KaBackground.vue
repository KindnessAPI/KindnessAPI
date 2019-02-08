<template>
  <div class="full" ref="insert">
  </div>
</template>

<script>
import * as home from '../gl/home/index.js'
export default {
  mounted () {
    home.setup({ dom: this.$refs['insert'] })
  }
}
</script>

<style>

</style>
