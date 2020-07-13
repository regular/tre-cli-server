const {join, resolve} = require('path')
const fs = require('fs')
const merge = require('lodash.merge')
const debug = require('debug')('tre-cli-server')
const netDefaults = require('./lib/network-config-defaults')
const Sbot = require('./lib/sbot')

const ssbKeys = require('ssb-keys')
const rc = require('rc')

getConfig( (err, conf, browserKeys) =>{
  if (err) {
    console.error(err.message)
    process.exit(1)
  }
  const keys = ssbKeys.loadOrCreateSync(join(conf.path, 'secret'))
  debug('Config is: %O', conf)
  debug('sbot id: %s', keys.id)
  Sbot(conf, keys, browserKeys, (err, ssb) =>{
    fs.writeFileSync(join(conf.path, 'address'), ssb.getAddress('device'), 'utf8')
  })
})

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
