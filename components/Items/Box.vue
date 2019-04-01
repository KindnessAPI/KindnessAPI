<template>
  <div>

  </div>
</template>

<script>
import { Mesh, BoxBufferGeometry, ShaderMaterial } from 'three'
export default {
  props: {
    size: {
      default () {
        return { x: 20, y: 20, z: 20 }
      }
    },
    color: {
      default () {
        return { x: Math.random().toFixed(1), y: Math.random().toFixed(1), z: Math.random().toFixed(1) }
      }
    }
  },
  data () {
    return {
      box: false
    }
  },
  mounted () {
    let geo = new BoxBufferGeometry(this.size.x, this.size.y, this.size.z, 4, 4, 4)
    let mat = new ShaderMaterial({
      transparent: true,
      vertexShader: `
        void main()	{
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        void main (void) {
          gl_FragColor = vec4(${this.color.x}, ${this.color.y}, ${this.color.z}, 0.7);
        }
      `
    })
    this.box = new Mesh(geo, mat)
    this.$parent.$emit('add', this.box)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.box)
  }
}
</script>

<style>

</style>
