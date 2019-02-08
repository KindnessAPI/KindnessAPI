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

import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'

import * as wavy from './wavy/wavy'
import * as dat from 'dat.gui'

var CONFIG = {
  camPos: [0.00000905161650112143, -1.6328903203517724, 0.017842728918007384],
  bgColor: 0x50505,
  bloomPass: {
    threshold: 0.00001,
    strength: 4.5,
    radius: 1.0
  }
}

var renderer, composer, size, scene, camera, rAFID, dpi, gui, graph, bloomPass

var syncSizeHandler = () => {
  composer.setSize(size.width * dpi, size.height * dpi)
  renderer.setPixelRatio(dpi)
  renderer.setSize(size.width, size.height)
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
}

var addColor = ({ gui, color }) => {
  let obj = {
    color: color.getHex()
  }
  let api = gui.addColor(obj, 'color')
  api.onChange((val) => {
    color.setHex(val)
    color.needsUpdate = true
  })
  return api
}

var setupEditorGUI = ({ dom }) => {
  let visible = true
  gui = new dat.GUI({ name: 'home', autoPlace: visible })
  // gui.useLocalStorage = false

  gui.add(bloomPass, 'threshold', 0, 1);
  gui.add(bloomPass, 'strength', 0, 10);
  gui.add(bloomPass, 'radius', 0, 3);

  addColor({ gui, color: scene.background })

  var control = new THREE.OrbitControls(camera, dom)
  control.addEventListener('change', () => {
    console.log(`${camera.position.x}, ${camera.position.y}, ${camera.position.z}`)
  })
  setInterval(() => {
    control.update()
  }, 1000 / 60)

  window.addEventListener('cleanup-gl', () => {
    gui.destroy()
  })
}

var setupCamera = () => {
  let fov = 75
  let aspect = size.width / size.height
  let near = 0.1
  let far = 1000

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.fromArray(CONFIG.camPos)
  camera.lookAt(0,0,0)
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
  scene.background = new THREE.Color(CONFIG.bgColor)
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
  window.addEventListener('resize', syncSizeHandler)
}

var setupComposer = () => {
  composer = new THREE.EffectComposer(renderer)

  let renderBG = new THREE.RenderPass(scene, camera)

  bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(size.width * dpi, size.height * dpi), 1.5, 0.4, 0.85)
  bloomPass.renderToScreen = true

  bloomPass.threshold = CONFIG.bloomPass.threshold
  bloomPass.strength = CONFIG.bloomPass.strength
  bloomPass.radius = CONFIG.bloomPass.radius

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

export const setupGraph = ({ dom }) => {
  // objects
  graph = graph || {}
  graph.waveAPI = wavy.getAPI({ scene, camera, gui, CONFIG })
  return {
    runAll: () => {
      graph.waveAPI.render()
    }
  }
}
export const setup = ({ dom }) => {
  setupWindowResize({ dom })
  setupRenderer({ dom })
  setupCamera()
  setupScene()
  setupComposer()

  // sync once
  syncSizeHandler()

  // setupEditorGUI({ dom })

  let runners = setupGraph({ dom })

  function loop () {
    rAFID = window.requestAnimationFrame(loop)
    runners.runAll()
    run()
  }
  rAFID = window.requestAnimationFrame(loop)
}

export const clean = () => {
  window.cancelAnimationFrame(rAFID)
  window.dispatchEvent(new Event('cleanup-gl'))
}
