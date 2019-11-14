const path = require('path')
const { setBuildExternals } = require('@laura-wert/vue-helpers/build-helpers')

module.exports = {
  css: {
    extract: false,
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.module.rule('vue').delete()
      config.module.rule('ts').uses.delete('cache-loader')
      config.module
        .rule('ts')
        .use('ts-loader')
        .loader('ts-loader')
        .tap((options) => {
          options.configFile = 'tsconfig.build.json'
          options.transpileOnly = false
          options.happyPackMode = false
          return options
        })
      config.plugin('vue-loader').delete()
    }
  },
  configureWebpack: (config) => {
    config.resolve.alias.tests = path.resolve(__dirname, './tests')
    if (process.env.NODE_ENV === 'production') {
      config.module.rules.forEach((v) => {
        if (v.use) {
          const idx = v.use.findIndex((w) => w.loader === 'thread-loader')
          if (idx !== -1) v.use.splice(idx, 1)
        }
      })
    }

    setBuildExternals(config)
    if (config.mode === 'production') {
      config.externals['axios-mock-adapter'] = 'axios-mock-adapter'
      config.externals.sinon = 'sinon'
    }
  },
}
