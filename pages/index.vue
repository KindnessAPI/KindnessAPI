<template>
  <div class="full">
    <no-ssr>
      <KaBackground @api="(v) => { api = v; }"></KaBackground>
    </no-ssr>
    <div class="pos-abs">
      <button @click="onMp3">Mp3 Player</button>
      <button id="mic" @click="onMic">Mic</button>
      <button @click="tata = !tata;">Editor</button>
      <no-ssr placeholder="">
        <editor class="tata" v-model="fs" v-if="tata" @init="editorInit" lang="glsl" theme="monokai" :width="'100vw'" :height="'calc(100vh - 50px)'"></editor>

        <!-- <codemirror v-show="tata" class="tata" v-model="fs" :options="cmOptions"></codemirror> -->
      </no-ssr>
    </div>
  </div>
</template>

<script>
import KaBackground from '../components/KaBackground.vue'

export default {
  components: {
    KaBackground,
    editor: process.browser ? require('vue2-ace-editor') : {}
  },
  data () {
    return {
      tata: false,
      api: false,
      fs: require('raw-loader!../gl/audio/visualiser/tPos.working.frag')
    }
  },
  watch: {
    fs () {
      this.onShaderEdit()
    }
  },
  mounted () {
  },
  methods: {
    editorInit (editor) {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/glsl')
      require('brace/theme/monokai')

      var commands = [
        {
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: () => {
            // let newCode = this.editor.getValue()
            // this.currentMod.src = newCode
            // this.Data.ts.modules.update(this.currentMod)
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'multicursor',
          bindKey: { win: 'Ctrl-D', mac: 'Command-D' },
          exec: function (editor) {
            editor.selectMore(1)
          },
          // multiSelectAction: 'forEach',
          scrollIntoView: 'cursor',
          readOnly: true // false if this command should not apply in readOnly mode
        }
      ]

      commands.forEach((command) => {
        editor.commands.addCommand(command)
      })
    },
    onShaderEdit () {
      this.api.vizer.onShaderEdit({
        fs: this.fs
      })
    },
    onMic () {
      if (this.api.vizer) {
        this.api.vizer.onMic({})
      }
    },
    onMp3 () {
      let fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.onchange = () => {
        let ob = { url: URL.createObjectURL(fileInput.files[0]) }
        if (this.api.vizer) {
          this.api.vizer.onPlay(ob)
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
.tata{
  background-color: rgba(0,0,0,0.3);
  /* background-color: rgba(255,255,255,0.5); */
}
</style>
