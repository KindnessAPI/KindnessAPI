<template>
  <div class="hidden">
    <slot></slot>
  </div>
</template>

<script>
import { Object3D } from 'three'
export default {
  props: {
    position: {},
    quaternion: {},
    rotation: {},
    physics: {}
  },
  watch: {
    position: {
      deep: true,
      handler (v) {
        this.obj3D.position.copy(v)
      }
    },
    rotation: {
      deep: true,
      handler (v) {
        this.obj3D.rotation.x = v.x
        this.obj3D.rotation.y = v.y
        this.obj3D.rotation.z = v.z
      }
    },
    quaternion: {
      deep: true,
      handler (v) {
        this.obj3D.quaternion.copy(v)
      }
    }
  },
  data () {
    return {
      obj3D: new Object3D()
    }
  },
  created () {
    this.$on('add', (object) => {
      this.obj3D.add(object)
    })
    this.$on('remove', (object) => {
      this.obj3D.remove(object)
    })
  },
  mounted () {
    this.position && this.obj3D.position.copy(this.position)
    this.rotation && this.obj3D.rotation.copy(this.rotation)
    this.quaternion && this.obj3D.quaternion.copy(this.quaternion)

    this.$parent.$emit('add', this.obj3D)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.obj3D)
  }
}
</script>

<style scpoed>
.hidden{
  display: none;
}
</style>
