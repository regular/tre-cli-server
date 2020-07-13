const debug = require('debug')('tre-cli-server:sbot')

module.exports = function(config, keys, browserKeys, cb) {
  const createSbot = require('tre-bot')()
    .use({
      manifest: {getAddress: "sync"},
      init: ssb => ({getAddress: scope => ssb.multiserver.address(scope)})
    })
    .use(require('ssb-sandboxed-views'))
    .use(require('tre-boot'))
    .use(require('ssb-backlinks'))
    .use(require('ssb-social-index')({
      namespace: 'about',
      type: 'about',
      destField: 'about'
    }))

  createSbot(config, keys, (err, ssb) => {
    if (err) return cb(err)
    debug('sbot manifest %o' + ssb.getManifest())
    debug(`public key ${keys.id}`)
    debug(`network key ${config.caps.shs}`)
    debug(`datapath: ${config.path}`)
    if (config.autoconnect) {
      let ac = config.autoconnect
      if (typeof ac == 'string') ac = [ac]
      ac.forEach(address => {
        debug(`auto-connecting to ${address}`)
        ssb.conn.remember(address)
        ssb.conn.connect(address)
      })
    }
    cb(null, ssb)
  })
}
