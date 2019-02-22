<template>
  <div class="full">
    <no-ssr>
      <KaBackground @api="(v) => { api = v; }"></KaBackground>
    </no-ssr>
    <div class="pos-abs">
      <button @click="onChoose">Mp3 Player</button>
      <button @click="onMic">Mic</button>
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
    onMic () {
      console.log(this.api)
      if (this.api.getGraph().viz) {
        this.api.getGraph().viz.onMic({})
      }
    },
    onChoose () {
      let fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.onchange = () => {
        let ob = { url: URL.createObjectURL(fileInput.files[0]) }
        if (this.api.getGraph().viz) {
          this.api.getGraph().viz.onPlay(ob)
        }
      }
      fileInput.click()
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
