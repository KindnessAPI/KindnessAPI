<template>
  <div class="full" ref="entryDOM">
    <no-ssr placeholder="Loading...">
      <div class="mic" v-if="!ready">
        <button @click="onStart">
          Start
        </button>
      </div>
      <StaticUniverse v-if="ready" />
    </no-ssr>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import StaticUniverse from '@/components/Pipeline/StaticUniverse.vue'
export default {
  components: {
    StaticUniverse
  },
  data () {
    return {
      ready: true
    }
  },
  methods: {
    onStart () {
      this.ready = true
      if (screenfull.enabled) {
        screenfull.request(this.$refs['entryDOM']);
      }
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
