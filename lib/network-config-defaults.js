const {join} = require('path')
const debug = require('debug')('tre-config-defaults')
const ssbKeys = require('ssb-keys')
const ssbConfigDefaults = require('ssb-config/defaults')
const mkdirp = require('mkdirp')
const defaultCap = require('ssb-caps/caps.json')

module.exports = function defaultConfig(config, cb) {
  debug(`loadOrCreate ${config.path}`)
  mkdirp.sync(config.path)

    if (config.network) {
      if (!config.capss || !config.caps.shs) {
        config.caps = config.caps || {}
        config.caps.shs = config.network.slice(1).replace(/\.[^.]+$/, '')
      }
    } else {
      config.network = `*${config.caps && config.caps.shs || defaultCap.shs}.random`
    }
    config.appkey = config.caps.shs
    config.blobs = {
      legacy: false,
      sympathy: 10,
      max: 314572800
    }

    // ssbConfigDefaults seems to remove ws.port
    const wsPort = config.ws.port
    config = ssbConfigDefaults('', config)

    // ssbConfigDefaults put keys here, we dont want that
    delete config.keys
    // ssbConfigDefaults delete ws props. We dont want that
    config.ws.port = wsPort
    cb(null, config)
}

