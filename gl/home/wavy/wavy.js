import * as THREE from 'three'
export const setupObject = ({ scene, camera, gui, CONFIG }) => {
  let uniforms = {
    time: { value: 0 }
  }

  let material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    vertexShader: require('raw-loader!./vs.vert'),
    fragmentShader: require('raw-loader!./fs.frag')
  })

  let n = 128
  let geometry = new THREE.BoxBufferGeometry(2, 2, 2, n, n, n)
  let object = new THREE.Points(geometry, material)

  scene.add(object)

  return {
    uniforms
  }
}

export const setupRender = ({ uniforms, camera }) => () => {
  uniforms.time.value = window.performance.now() * 0.0001
}

export const getAPI = (env) => {
  let { scene, camera, gui, CONFIG } = env
  let { uniforms } = setupObject({ scene, camera, gui, CONFIG })
  return {
    render: setupRender({ uniforms, camera })
  }
}
