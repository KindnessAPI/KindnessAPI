import * as THREE from 'three'
// import 'imports-loader?THREE=three!three/examples/js/GPUComputationRenderer.js'
import GPUComputationRenderer from '../../shared/GPGPU.js'
// import StripsGeo from '../../shared/strip.js'
// var particleVelocityShader = require('raw-loader!./sim.velocity.frag')
// var particlePositionShader = require('raw-loader!./sim.position.frag')
// var particleVertexShader = require('raw-loader!./display.vert')
// var particleFragmentShader = require('raw-loader!./display.frag')
/* eslint-enable */
export const makeAPI = ({ renderer, scene, camera, gui, CONFIG }) => {
  var api = {}

  let stripNum = 30
  let WIDTH = 2
  let HEIGHT = 10
  let WIDTH_BOUNDS = 2
  let HEIGHT_BOUNDS = stripNum

  var gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT * stripNum, renderer)
  var posDynamic = gpuCompute.createTexture();
  var posIdx = gpuCompute.createTexture();
  var pixels = posIdx.image.data;
  var p = 0;

  for ( var k = 0; k < stripNum; k++ ) {
    for ( var j = 0; j < HEIGHT; j++ ) {
      for ( var i = 0; i < WIDTH; i++ ) {
        pixels[ p + 0 ] = k / stripNum;
        pixels[ p + 1 ] = k;
        pixels[ p + 2 ] = 0;
        pixels[ p + 3 ] = 1;
        p += 4;
      }
    }
  }

  var posVar = gpuCompute.addVariable('tPos', require('raw-loader!./strip.tPos.frag'), posDynamic );
  posVar.material.defines.stripNum = stripNum.toFixed(1);
  posVar.material.uniforms.tIdx = { value: posIdx };
  gpuCompute.setVariableDependencies( posVar, [ posVar ] );

  var error = gpuCompute.init();
  if (error !== null) {
    console.error(error)
  }

  let plane = ({ sX = 0.5, sY = 0.5, offsetX = 0, offsetY = 0, i, ik }) => {
    offsetY = i || 0
    offsetX = ik * (WIDTH + 1.0) || 0
    return {
      vertex: [
        1 * sX + offsetX, 1 * sY + offsetY, 0,
        -1 * sX + offsetX, 1 * sY + offsetY, 0,
        -1 * sX + offsetX, -1 * sY + offsetY, 0,

        1 * sX + offsetX, 1 * sY + offsetY, 0,
        -1 * sX + offsetX, - 1 * sY + offsetY, 0,
        1 * sX + offsetX, - 1 * sY + offsetY, 0
      ],
      uv: [
        1 * 0.5 + 0.5, 1 * 0.5 + 0.5,
        -1 * 0.5 + 0.5, 1 * 0.5 + 0.5,
        -1 * 0.5 + 0.5, -1 * 0.5 + 0.5,

        1 * 0.5 + 0.5, 1 * 0.5 + 0.5,
        -1 * 0.5 + 0.5, - 1 * 0.5 + 0.5,
        1 * 0.5 + 0.5, - 1 * 0.5 + 0.5
      ],
      idx: [
        ik / stripNum,
        ik / stripNum,
        ik / stripNum,
        ik / stripNum,
        ik / stripNum,
        ik / stripNum
      ]
    }
  }

  let makePos = () => {
    let vertex = [
    ];
    let uv = []
    let idx = []

    for (var ik = 0; ik < stripNum; ik++) {
      for (var i = 0; i < HEIGHT; i++) {
        let item = plane({ i, ik, sY: HEIGHT })
        vertex = vertex.concat(item.vertex)
        uv = uv.concat(item.vertex)
        idx = idx.concat(item.idx)
      }
    }

    return {
      vertex,
      uv,
      idx
    }
  }

  var infos = makePos();

  var geo = new THREE.InstancedBufferGeometry();
  geo.addAttribute('position',  new THREE.Float32BufferAttribute(infos.vertex, 3));
  geo.addAttribute('uv',  new THREE.Float32BufferAttribute(infos.uv, 2));
  geo.addAttribute('idx',  new THREE.Float32BufferAttribute(infos.idx, 1));
  geo.maxInstancedCount = stripNum

  geo.computeBoundingBox();

  var uniforms = {
    tPos: { value: null }
  }
  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    vertexShader: require('raw-loader!./display.vert'),
    fragmentShader: require('raw-loader!./display.frag')
  })

  material.defines.WIDTH = WIDTH.toFixed(1.0)
  material.defines.WIDTH_BOUNDS = WIDTH_BOUNDS.toFixed(1.0)
  material.defines.HEIGHT = HEIGHT.toFixed(1.0)
  material.defines.HEIGHT_BOUNDS = HEIGHT_BOUNDS.toFixed(1.0)

  // material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

  var mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  api.render = () => {
    gpuCompute.compute()
    uniforms.tPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
  }
  return api
}

export const getAPI = ({ renderer, scene, camera, gui, CONFIG }) => {
  let api = makeAPI({ renderer, scene, camera, gui, CONFIG })
  return api
}
