<template>
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
</template>

<script>
import * as iNet from '../plugins/inet.js'

export default {
  data () {
    return {
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
  }
}
</script>

<style scoped>
.my-wrapper{
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.my-content{
  margin: 29px;
  padding: 1px;
}
</style>
