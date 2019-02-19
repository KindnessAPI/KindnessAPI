import * as THREE from 'three'
// import 'imports-loader?THREE=three!three/examples/js/GPUComputationRenderer.js'
import GPUComputationRenderer from '../../shared/GPGPU.js'
import * as auau from '../audio/audio.js'

/* eslint-enable */
export const makeAPI = ({ renderer, scene, camera, gui, CONFIG }) => {
  var api = {
    audio: false
  }
  var WIDTH = 1024;
  var gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer)

  // pos IDX
  var posIdx = gpuCompute.createTexture();
  var slot = posIdx.image.data;
  var p = 0;
  for ( var j = 0; j < WIDTH; j ++ ) {
    for ( var i = 0; i < WIDTH; i ++ ) {
      let id = p / 4;
      slot[p + 0] = id % 6; // square 1 / 6 index
      slot[p + 1] = Math.floor(id / 6); // square
      slot[p + 2] = Math.floor(WIDTH * WIDTH / 4.0 / 6.0); // total
      slot[p + 3] = id;
      p += 4;
    }
  }

  var posDynamic = gpuCompute.createTexture();
  var posVar = gpuCompute.addVariable('tPos', require('raw-loader!./tPos.working.frag'), posDynamic );
  posVar.material.uniforms.tAudio = { value: null };
  posVar.material.uniforms.tIdx = { value: posIdx };
  posVar.material.uniforms.time = { value: 0 };
  gpuCompute.setVariableDependencies( posVar, [ posVar ] );

  var error = gpuCompute.init();
  if (error !== null) {
    console.error(error)
  }

  var geo = new THREE.BufferGeometry();

  let getUVInfo = () => {
    let newArr = []
    var na = 0;
    for ( var j = 0; j < WIDTH; j ++ ) {
      for ( var i = 0; i < WIDTH; i ++ ) {
        newArr[na + 0] = i / WIDTH;
        newArr[na + 1] = j / WIDTH;
        newArr[na + 2] = 0;
        na += 3;
      }
    }
    return newArr
  }

  geo.addAttribute('position',  new THREE.Float32BufferAttribute(getUVInfo(), 3));
  geo.addAttribute('posIdx',  new THREE.Float32BufferAttribute(posIdx.image.data, 4));

  var uniforms = {
    time: { value: 0 },
    tAudio: { value: null },
    tPos: { value: null },
    tIdx: { value: null }
  }
  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    defines: {
      resolution: `vec2(${renderer.domElement.width.toFixed(1)}, ${renderer.domElement.height.toFixed(1)})`
    },
    vertexShader: require('raw-loader!./display.vert'),
    fragmentShader: require('raw-loader!./display.frag'),
    side: THREE.DoubleSide
  })

  var mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  api.render = () => {
    if (api.audio) {
      posVar.material.uniforms.tAudio.value = api.audio.update().texture
      uniforms.tAudio.value = posVar.material.uniforms.tAudio.value
    }
    posVar.material.uniforms.time.value = window.performance.now() * 0.001
    uniforms.tPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    uniforms.tIdx.value = posIdx

    uniforms.time.value = window.performance.now() * 0.001
    gpuCompute.compute()
  }

  api.onInit = ({ url }) => {
    if (api.audio) {
      api.audio.pause()
    }
    api.audio = auau.setup({ url })
  }

  return api
}

export const getAPI = ({ renderer, scene, camera, gui, CONFIG }) => {
  let api = makeAPI({ renderer, scene, camera, gui, CONFIG })
  return api
}
