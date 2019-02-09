import * as THREE from 'three'
export const setupObject = ({ scene, camera, gui, CONFIG }) => {
  let uniforms = {
    time: { value: 0 },
    accel: { value: new THREE.Vector3() }
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

  window.addEventListener('deviceorientation', (evt) => {
    var absolute = evt.absolute

    var alpha    = evt.alpha / 360
    var beta     = evt.beta / 180
    var gamma    = evt.gamma / 90

    // console.log(evt, alpha, beta, gamma)
    uniforms.accel.value.set(alpha, beta, gamma)
  }, true)

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
