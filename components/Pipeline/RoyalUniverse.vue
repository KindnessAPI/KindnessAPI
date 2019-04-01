<template>
  <div class="full" ref="mounter">
    <Scene @ready="(v) => { scene = v }" >

      <Object3D v-if="worker">
        <PhysicsPass :size="oo.size" :move="oo.move" :id="oo._id" :geo="oo.geo" :physics="worker"  :key="oo._id" v-for="oo in boxes">
          <Object3D :quaternion="oo.quaternion" :position="oo.position">
            <Box :size="oo.size"></Box>
          </Object3D>
        </PhysicsPass>
      </Object3D>

      <PhysicsPass v-if="worker" :size="{ x: 9000, y: 1, z: 9000 }" :move="false" :id="'_floor'" :geo="'box'" :physics="worker">
        <Object3D :position="{ x: 0, y: -60, z: 5 }">
          <Box :size="{ x: 9000, y: 5, z: 9000 }" :color="{ x: 0.12, y: 0.12, z: 0.12 }"></Box>
        </Object3D>
      </PhysicsPass>

    </Scene>
  </div>
</template>

<script>
// imports
import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/FXAAShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js'

import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'

import FreeJS from '../FreeJS'
import * as THREE from 'three'
import Box from '../Items/Box.vue'

let getRD = () => {
  return `_${(Math.random() * 1000000).toFixed(0)}`
}

export default {
  components: {
    ...FreeJS,
    Box
  },
  data () {
    return {
      boxes: [
        {
          _id: getRD(),
          geo: 'box',
          move: true,
          size: { x: 20, y: 22, z: 20 },
          quaternion: { x: 0, y: 0, z: 0, w: 0 },
          position: { x: 0, y: 40, z: 0 },
        },
        {
          _id: getRD(),
          geo: 'box',
          move: true,
          size: { x: 20, y: 22, z: 20 },
          quaternion: { x: 0, y: 0, z: 0, w: 0 },
          position: { x: 0, y: 20, z: 0 },
        },
        {
          _id: getRD(),
          geo: 'box',
          move: true,
          size: { x: 20, y: 22, z: 20 },
          quaternion: { x: 0, y: 0, z: 0, w: 0 },
          position: { x: 0, y: 0, z: 0 },
        },
        {
          _id: getRD(),
          geo: 'box',
          move: true,
          size: { x: 20, y: 22, z: 20 },
          quaternion: { x: 0, y: 0, z: 0, w: 0 },
          position: { x: 0, y: -20, z: 0 },
        },
        {
          _id: getRD(),
          geo: 'box',
          move: true,
          size: { x: 20, y: 22, z: 20 },
          quaternion: { x: 0, y: 0, z: 0, w: 0 },
          position: { x: 0, y: -40, z: 0 },
        }
      ],
      size: false,
      dpi: 2,
      rAFID: 0,
      scene: false,
      renderer: false,
      camera: false,
      worker: false,
      readyInit: false,
      Settings: {
        camPos: [
          4.428399491709158,
          -24.619363082149615,
          -137.212497523395
        ],
        bloomPass: {
          threshold: 0.0846740050804403,
          strength: 0.9551227773073666,
          radius: 1.0343776460626588
        }
      }
    }
  },
  beforeDestroy () {
    this.stop()
  },
  created () {
    for (var i = 0; i < 15; i++) {
      this.boxes.push({
        _id: getRD(),
        geo: 'box',
        move: true,
        size: { x: 10, y: 10, z: 10 },
        position: { x: i * 10.0, y: 0 + i * 15.0, z: 0 },
      })
    }
  },
  mounted () {
    this.setupPhysics()
  },
  watch: {
    scene () {
      if (this.worker && this.scene) {
        this.init()
      }
    },
    worker () {
      if (this.worker && this.scene) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.setupRenderer()
      this.setupSizer()
      this.setupCamera()
      this.setupComposer()
      this.setupControl()
      this.syncSize()
      this.start()
    },
    setupPhysics () {
      if (process.client) {
        if (this.worker) {
          this.worker.terminate()
        }
        import('worker-loader?inline=true!../FreeJS/Physics.worker.js').then(mod => {
          let PhysicsWorkerScript = mod.default
          this.worker = new PhysicsWorkerScript()
          this.worker.addEventListener('message', (evt) => {
            let data = evt.data

            let type = data.type
            let db = data.db

            if (type === 'update' && db) {
              db.forEach((entry) => {
                let box = this.boxes.find(b => b._id === entry._id)
                if (box) {
                  box.position = entry.position
                  box.quaternion = entry.quaternion
                }
              })
            }
          })
          this.worker.postMessage({ type: 'setup' })
        })
      }
    },
    setupControl () {
      var control = new THREE.OrbitControls(this.camera, this.renderer.domElement)
      this.control = control
      control.enableDamping = true
      control.enableKeys = false
    },
    setupRenderer () {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false
      })
      this.$refs['mounter'].appendChild(this.renderer.domElement)
    },
    setupCamera () {
      let { size, Settings } = this
      let fov = 75
      let aspect = size.width / size.height
      let near = 0.1
      let far = 10000

      let camera = this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
      camera.position.fromArray(Settings.camPos)
      camera.lookAt(0,0,0)
    },
    setupComposer () {
      let composer = this.composer = new THREE.EffectComposer(this.renderer)
      let { scene, camera, size, dpi, Settings } = this
      let renderBG = new THREE.RenderPass(scene, camera)

      let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(size.width * dpi, size.height * dpi), 1.5, 0.4, 0.85)
      bloomPass.renderToScreen = true

      bloomPass.threshold = Settings.bloomPass.threshold
      bloomPass.strength = Settings.bloomPass.strength
      bloomPass.radius = Settings.bloomPass.radius

      composer.addPass(renderBG)
      composer.addPass(bloomPass)
    },
    setupSizer () {
      this.getSizeInfo()
      window.addEventListener('resize', this.getSizeInfo, false)
    },
    getSizeInfo () {
      var rect = this.$refs['mounter'].getBoundingClientRect()
      this.size = {
        width: rect.width,
        height: rect.height,
        aspect: rect.width / rect.height
      }
      this.dpi = 2.0 //window.devicePixelRatio || 1.0
    },
    syncSize () {
      let sync = () => {
        let { composer, renderer, camera, size, dpi, control } = this
        control.update()
        composer.setSize(size.width * dpi, size.height * dpi)
        renderer.setPixelRatio(dpi)
        renderer.setSize(size.width, size.height)
        camera.aspect = size.width / size.height
        camera.updateProjectionMatrix()
      }
      sync()
      window.addEventListener('resize', sync, false)
    },
    stop () {
      window.cancelAnimationFrame(this.rAFID)
    },
    start () {
      let rAF = () => {
        this.rAFID = window.requestAnimationFrame(rAF)
        this.render()
      }
      this.rAFID = window.requestAnimationFrame(rAF)
    },
    render () {
      let { scene, camera, renderer, composer } = this
      if (scene && camera && renderer && composer) {
        composer.render()
      } else if (scene && camera && renderer) {
        renderer.render(scene, camera)
      }
    }
  }
}
</script>

<style scoped>
.full {
  width: 100%;
  height: 100%;
}
</style>
