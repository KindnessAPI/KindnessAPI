import * as THREE from 'three'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/FXAAShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js'

import * as wavy from './wavy/wavy'

var renderer, composer, size, scene, camera, rAFID, dpi
var syncSize = () => {
  composer.setSize(size.width * dpi, size.height * dpi)
  renderer.setPixelRatio(dpi)
  renderer.setSize(size.width, size.height)
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
}

var setupCamera = () => {
  let fov = 75
  let aspect = size.width / size.height
  let near = 0.1
  let far = 1000
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
}

var setupRenderer = ({ dom }) => {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true
  })

  renderer.domElement.style.marginBottom = '-6px'
  dom.appendChild(renderer.domElement)
}

var setupScene = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#000000')
}

var setupWindowResize = ({ dom }) => {
  var resizer = () => {
    var rect = dom.getBoundingClientRect()
    size = {
      width: rect.width,
      height: rect.height,
      aspect: rect.width / rect.height
    }
    dpi = window.devicePixelRatio || 1.0
  }
  window.addEventListener('resize', resizer)
  resizer()
}

var setupComposer = () => {
  composer = new THREE.EffectComposer(renderer)

  let renderBG = new THREE.RenderPass(scene, camera)
  let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(size.width * dpi, size.height * dpi), 1.5, 0.4, 0.85)
  bloomPass.renderToScreen = true

  bloomPass.threshold = Number(0.0001)
  bloomPass.strength = Number(3.5)
  bloomPass.radius = Number(1.0)

  composer.addPass(renderBG)
  composer.addPass(bloomPass)
}

var run = () => {
  let useBloom = true
  if (useBloom && scene && camera && renderer && composer) {
    composer.render()
  } else if (scene && camera && renderer) {
    renderer.render(scene, camera)
  }
}

export const setup = ({ dom }) => {
  setupWindowResize({ dom })

  setupRenderer({ dom })
  setupCamera()
  setupScene()
  setupComposer()

  syncSize()

  let waveAPI = wavy.getAPI({ scene, camera })

  function loop () {
    rAFID = window.requestAnimationFrame(loop)
    waveAPI.render()
    run()
  }
  rAFID = window.requestAnimationFrame(loop)
}

export const clean = () => {
  window.cancelAnimationFrame(rAFID)
}
