import Vue from 'vue'

export default () => {
  if (process.browser) {
    let VueHammer = require('vue2-hammer').VueHammer
    Vue.use(VueHammer)
  }
}
