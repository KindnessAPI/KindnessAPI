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

import * as visualiser from './visualiser/visualiser.js'
import * as dat from 'dat.gui'

var CONFIG = {
  edit: true && !(process.env.NODE_ENV === 'production'),
  // camPos: [0.00000905161650112143, -1.6328903203517724, 0.017842728918007384],
  camPos: [0.0, 0.0, -92.02815636422251],
  // camPos: [-128.25260300180648, -187.13927469115663, -179.79203414429605],
  // camPos: [70.6803230191502, 126.7125806507623, -401.1762804647324],
  bgColor: 0x50505,

  useComposer: true,
  // bloomPass: {
  //   threshold: 0.00001,
  //   // strength: 4.5,
  //   strength: 2.3,
  //   radius: 1.0
  // },
  // bloomPass: {
  //   threshold: 0.27,
  //   strength: 0.74,
  //   radius: 1.0
  // },
  bloomPass: {
    threshold: 0.17,
    strength: 2.36,
    radius: 1.0
  }
}

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
    console.log(`${camera.position.x}, ${camera.position.y}, ${camera.position.z}`)
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
  let useBloom = CONFIG.useComposer
  if (useBloom && scene && camera && renderer && composer) {
    composer.render()
  } else if (scene && camera && renderer) {
    renderer.render(scene, camera)
  }
}

export const setupGraph = ({ dom }) => {
  // objects
  graph = graph || {}
  graph.visualiser = visualiser.getAPI({ dom, renderer, scene, camera, gui, CONFIG })
  return {
    getGraph: () => {
      return graph
    },
    runAll: () => {
      graph.visualiser.render()
    },
    onInit: ({ url }) => {
      graph.visualiser.onInit({ url })
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

  CONFIG.edit && setupEditorGUI({ dom })

  runners = setupGraph({ dom })

  function loop () {
    rAFID = window.requestAnimationFrame(loop)
    runners.runAll()
    run()
  }
  rAFID = window.requestAnimationFrame(loop)
}

export const onInit = ({ url }) => {
  runners.onInit({ url })
}

export const clean = () => {
  window.cancelAnimationFrame(rAFID)
  window.dispatchEvent(new Event('cleanup-gl'))
}
