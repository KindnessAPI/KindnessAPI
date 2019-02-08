import * as THREE from 'three'
export const setupInternal = ({ scene, camera }) => {
  let uniforms = {
    time: { value: 0 }
  }
  let material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    vertexShader: require('raw-loader!./vs.vert'),
    fragmentShader: require('raw-loader!./fs.frag')
  })
  camera.position.z = 5
  let n = 128
  let geometry = new THREE.BoxBufferGeometry(2, 2, 2, n, n, n)
  let object = new THREE.Points(geometry, material)
  scene.add(object)

  return {
    uniforms
  }
}

export const render = ({ uniforms, camera }) => () => {
  uniforms.time.value = window.performance.now() * 0.0001
}

export const getAPI = (env) => {
  let { scene, camera } = env
  let { uniforms } = setupInternal({ scene, camera })
  return {
    render: render({ uniforms, camera })
  }
}
