import * as THREE from 'three'

export const setup = ({ url }) => {
  var api = {}
  var fftSize = 512 // up to 2048 with pow2
  var listener = new THREE.AudioListener()

  var analyser, texture = null, sound

  navigator.mediaDevices.getUserMedia( { audio: true, video: false } ).then((stream) => {
    sound = new THREE.Audio(listener)
    var context = listener.context;
    listener.setMasterVolume(0.);
    var source = context.createMediaStreamSource( stream );
    sound.setNodeSource( source );

    analyser = new THREE.AudioAnalyser(sound, fftSize)
    console.log(analyser.data)
    texture = new THREE.DataTexture(analyser.data, fftSize / 2.0, 1.0, THREE.LuminanceFormat)
  });

  api.pause = () => {
    sound.pause()
  }

  api.update = () => {
    if (analyser) {
      analyser.getFrequencyData()
      // analyser.getAverageFrequency()
    }
    if (texture) {
      texture.needsUpdate = true
    }

    return {
      texture
    }
  }
  return api
}

/*
var listener = new THREE.AudioListener();
camera.add( listener );

navigator.mediaDevices.getUserMedia( { sound: true, video: false } ).then( handleSuccess );

function handleSuccess( stream ) {

    var sound = new THREE.Audio( listener );
}
*/
