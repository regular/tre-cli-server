const fs = require('fs')
const {join} = require('path')
const merge = require('lodash.merge')
const debug = require('debug')('tre-cli-server')
const ssbKeys = require('ssb-keys')
const rc = require('rc')

const netDefaults = require('./lib/network-config-defaults')
const Sbot = require('./lib/sbot')

module.exports = function(argv, cb) {
  getConfig( (err, conf, browserKeys) =>{
    if (err) return cb(err)
    const keys = ssbKeys.loadOrCreateSync(join(conf.path, 'secret'))
    debug('Config is: %O', conf)
    debug('sbot id: %s', keys.id)
    Sbot(conf, keys, browserKeys, (err, ssb) =>{
      if (err) return cb(err)
      cb(null, ssb, conf)
    })
  })
}

// -- utils

function mixinDefaults(conf) {
  return merge({}, JSON.parse(fs.readFileSync(join(__dirname, 'default-config.json'))), conf || {})
}
      
function getConfig(cb) {
  let conf = rc('tre')
  if (!conf.path && !conf.config) {
    return cb(new Error('.trerc not found, use --config CONFIG'))
  }

  conf.path = conf.path || join(conf.config, '../.tre')
  conf = mixinDefaults(conf)
  netDefaults(conf, cb)
}
