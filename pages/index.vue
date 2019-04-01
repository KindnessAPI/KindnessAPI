<template>
  <div class="full posrel base-div" ref="entryDOM">
    <no-ssr placeholder="Loading...">
      <!-- <div class="mic" v-if="!ready">
        <button @click="onStart">
          Start
        </button>
      </div> -->
      <PhysicsLocally :toucher="$refs['toucher']" />
    </no-ssr>
    <div class="full posabs" :ref="'toucher'">
      <div class="my-wrapper">
        <div class="my-content">
          <h1>
            KindnessAPI
          </h1>
          <h2>
            Jots, Writings, Quotes and Aphorisms by <a target="_blank" href="https://www.wonglok.com">Wong Lok</a>
          </h2>

          <h3>
            Thoguht Process and Mindset of How did I become happy again.
          </h3>

          <ol>
            <li :key="qq.uri" v-for="qq in quotes">
              <span>
                {{ qq.text }}
              </span>
            </li>
          </ol>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import PhysicsLocally from '@/components/Pipeline/PhysicsLocally.vue'
import * as iNet from '../plugins/inet.js'

export default {
  components: {
    PhysicsLocally
  },
  data () {
    return {
      ready: true,
      meta: false,
      quotes: false
    }
  },
  async asyncData ({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    let resp = await iNet.getDataWithProxy({ url: `https://www.wonglok.com/quotes/?as=json&limit=100` })
    return {
      meta: resp.data.meta,
      quotes: resp.data.data
    }
  },
  methods: {
    onStart () {
      this.ready = true
      if (screenfull.enabled) {
        screenfull.request(this.$refs['entryDOM']);
      }
    }
  }
}
</script>

<style>
body,html{
  background-color: black;
}
</style>


<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.posrel{
  position: relative;
}
.posabs{
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translateZ(10px);
}
.base-div{
  background-color: black;
}

.my-wrapper{
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  color: white;
  text-shadow: 0px 0px 10px black;
}
.my-content{
  margin: 29px;
  padding: 1px;
}

.my-wrapper a,
.my-wrapper a:hover,
.my-wrapper a:active,
.my-wrapper a:visited,
.my-wrapper a:focus{
  color: white;
  text-shadow: 0px 0px 5px blue;
}

.my-wrapper a:hover{
  color: rgb(72, 22, 255);
}
</style>
