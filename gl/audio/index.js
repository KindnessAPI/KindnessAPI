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

import * as viz from './visualiser/visualiser.js'
import * as dat from 'dat.gui'

var Settings = require('./settings.json');
Settings.edit = true && !(process.env.NODE_ENV === 'production')

window.SAVE_SETTINGS_AUDIO_VIZ = () => {
  Settings.camPos = [
    camera.position.x, camera.position.y, camera.position.z
  ]
  Settings.bloomPass = {
    threshold: bloomPass.threshold,
    strength: bloomPass.strength,
    radius: bloomPass.radius
  }
  Settings.bgColor = scene.background.getHex()
  console.log(JSON.stringify(Settings, null, '  ').replace(new RegExp(`"`, 'ig'), ''))
  return Settings
};

console.log(`copy(SAVE_SETTINGS_AUDIO_VIZ());`)

var renderer, composer, size, scene, camera, rAFID, dpi, gui, graph, bloomPass, runners

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

  gui.add(bloomPass, 'threshold', 0, 1);
  gui.add(bloomPass, 'strength', 0, 10);
  gui.add(bloomPass, 'radius', 0, 3);

  addColor({ gui, color: scene.background })

  var control = new THREE.OrbitControls(camera, dom)
  control.enableDamping = true
  control.enableKeys = false
  control.addEventListener('change', () => {
    // console.log(`${camera.position.x}, ${camera.position.y}, ${camera.position.z}`)
  })
  setInterval(() => {
    control.update()
  }, 1000 / 60)

  window.addEventListener('cleanup-gl', () => {
    try {
      gui.destroy()
    } catch (e) {
      console.log('err destorying gui tool', e)
    }
  })
}

var setupCamera = () => {
  let fov = 75
  let aspect = size.width / size.height
  let near = 0.1
  let far = 10000

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.fromArray(Settings.camPos)
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
  scene.background = new THREE.Color(Settings.bgColor)
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

  bloomPass.threshold = Settings.bloomPass.threshold
  bloomPass.strength = Settings.bloomPass.strength
  bloomPass.radius = Settings.bloomPass.radius

  composer.addPass(renderBG)
  composer.addPass(bloomPass)
}

var run = () => {
  let useBloom = Settings.useComposer
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

  // sync once
  syncSizeHandler()

  Settings.edit && setupEditorGUI({ dom })

  let vizer = viz.getAPI({ dom, renderer, scene, camera, gui, Settings })

  function loop () {
    rAFID = window.requestAnimationFrame(loop)
    vizer.render()
    run()
  }
  rAFID = window.requestAnimationFrame(loop)

  return {
    vizer
  }
}

export const clean = () => {
  window.cancelAnimationFrame(rAFID)
  window.dispatchEvent(new Event('cleanup-gl'))
}
