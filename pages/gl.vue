<template>
  <div class="full">
    <no-ssr>
      <KaBackground @api="(v) => { api = v; }"></KaBackground>
    </no-ssr>
    <div class="pos-abs">
      <button @click="onChoose">Choose</button>
    </div>
  </div>
</template>

<script>
import KaBackground from '../components/KaBackground.vue'

export default {
  components: {
    KaBackground
  },
  data () {
    return {
      api: false
    }
  },
  methods: {
    onChoose () {
      let fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.onchange = () => {
        this.onInit({ url: URL.createObjectURL(fileInput.files[0]) })
      }
      fileInput.click()
    },
    onInit ({ url }) {
      if (this.api) {
        this.api.onInit({ url })
      }
    }
  }
}
</script>

<style scoped>
.pos-abs{
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
