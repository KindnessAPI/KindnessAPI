<template>
  <div class="full ka-main">
    <no-ssr>
      <KaBackground></KaBackground>
    </no-ssr>
    <KaTopBar v-if="!search.open" @menu="(v) => { menu.open = v }" @search="(v) => { search.open = v }"></KaTopBar>
    <KaBottomSheet></KaBottomSheet>
    <KaMenu :menu="menu.open" @menu="(v) => { menu.open = v }"></KaMenu>
    <KaSearchOverlay :search="search.open" @search="(v) => { search.open = v }" ></KaSearchOverlay>
    <KaSearchBar v-if="search.open" :search="search.open" @search="(v) => { search.open = v }" @query="(v) => { search.query = v }"></KaSearchBar>
  </div>
</template>

<script>
import * as iNet from '../plugins/inet.js'
import KaBottomSheet from '../components/KaBottomSheet.vue'
import KaTopBar from '../components/KaTopBar.vue'
import KaMenu from '../components/KaMenu.vue'
import KaSearchOverlay from '../components/KaSearchOverlay.vue'
import KaSearchBar from '../components/KaSearchBar.vue'
import KaBackground from '../components/KaBackground.vue'
export default {
  layout: 'mobile',
  components: {
    KaBottomSheet,
    KaTopBar,
    KaMenu,
    KaSearchOverlay,
    KaSearchBar,
    KaBackground
  },
  data () {
    return {
      search: {
        query: '',
        open: false
      },
      menu: {
        open: false
      }
    }
  },
  // async asyncData ({ isDev, route, store, env, params, query, req, res, redirect, error }) {
  //   let resp = await iNet.getDataWithProxy({ url: `https://www.wonglok.com/quotes/?as=json&limit=100` })
  //   return {
  //     datame: resp.data
  //   }
  // },
  beforeCreate () {
    this.$parent.$emit('title', 'home')
  }
}
</script>

<style lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.ka-main{
  position: relative;
  overflow: hidden;
}

</style>
