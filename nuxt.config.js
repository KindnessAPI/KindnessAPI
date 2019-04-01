const pkg = require('./package')

module.exports = {
  mode: 'universal',

  server: {
    host: '0.0.0.0'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'Kindness API | Spread Kidness with Technology',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Trying to make Kindness Popular with Rich Interactions and Visuals' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  serverMiddleware: [
  ],

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    //'https://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css'
    // 'iview/dist/styles/iview.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/muse-ui',
    '@/plugins/hammer',
    // '@/plugins/iview',
    '@/plugins/firebase'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    hotMiddleware: {
      reload: true
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        // make worker work, window is not defined fix.
        config.output.globalObject = 'this'
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
