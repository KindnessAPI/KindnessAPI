<template>
  <div class="hidden">
    <slot></slot>
  </div>
</template>

<script>
import { Object3D } from 'three'
export default {
  props: {
    id: {},
    physics: {},
    geo: {
      default: 'sphere'
    },
    move: {
      default: false
    },
    size: {
      default () {
        return {
          x: 11, y: 11, z: 11
        }
      }
    },
    density: {
      default: 5.0
    },
    friction: {
      default: 0.2
    },
    restitution: {
      default: 0.2
    },
    belongsTo: {
      default: 1
    },
    collidesWith: {
      default: 0xffffffff
    },
  },
  watch: {

  },
  data () {
    return {
      obj3D: false
    }
  },
  created () {
    this.$on('add', (object) => {
      this.obj3D = object
      this.physics.postMessage({
        _id: this.id,
        type: 'addItem',
        position: object.position.toArray(),
        rotation: object.rotation.toArray().map(v => v / Math.PI / 2 * 360),
        geo: this.geo,
        move: this.move,
        size: this.size,

        density: this.density || 1,
        friction: this.friction || 0.2,
        restitution: this.restitution || 0.2,
        belongsTo: this.belongsTo || 1, // The bits of the collision groups to which the shape belongs.
        collidesWith: this.collidesWith || 0xffffffff
      })
      this.$parent.$emit('add', object)
    })
    this.$on('remove', (object) => {
      this.obj3D = object
      this.physics.postMessage({ type: 'removeItem', _id: this.id })
      this.$parent.$emit('remove', object)
    })
  },
  mounted () {
    this.physics.addEventListener('message', (evt) => {
      let data = evt.data

      let type = data.type
      let db = data.db
      if (type === 'update' && db) {
        let index = db.findIndex(b => b._id === this.id)
        if (index !== -1) {
          let info = db[index]
          //
          this.obj3D.position.copy(info.position)
          this.obj3D.quaternion.copy(info.quaternion)
        }
      }
    })
  },
  beforeDestroy () {
  }
}
</script>

<style scpoed>
.hidden{
  display: none;
}
</style>
