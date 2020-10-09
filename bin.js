#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
if (!process.env.DEBUG && argv._.length == 0) {
  process.env.DEBUG='multiserver*,tre-cli-server:*'
}
const fs = require('fs')
const {join} = require('path')
const {spawn} = require('child_process')
const debug = require('debug')('tre-cli-server:bin')
const server = require('.')

debug('parsed command line arguments: %O', argv)

if (argv.help || [!0,2].includes(argv.length) ) {
  const bin = argv['run-by-tre-cli'] ? 'tre server' : 'tre-cli-server'
  if (argv.help) {
    console.log(require('./help')(bin))
    process.exit(0)
  } else {
    console.error('Invalid number of arguments')
    console.error(require('./usage')(bin))
    process.exit(1)
  }
  if (argv._[0] && argv._[0] !== 'run') {
    console.error(`Invalid sub command: ${argv._[0]}`)
    console.error(require('./usage')(bin))
    process.exit(1)
  }
}

server(argv, (err, ssb, conf) =>{
  if (err) {
    console.error(err.message)
    process.exit(1)
  }
  const address = ssb.getAddress('device')
  fs.writeFileSync(join(conf.path, 'address'), address, 'utf8')
  debug(`server started at ${address}`)
  if (argv._.length == 2) {
    const [_, shellCommand] = argv._
    debug('Running %s', shellCommand)
    const child = spawn('/bin/sh', [
      '-c', shellCommand
    ], {
      stdio: 'inherit',
      env: Object.assign({}, process.env, {
        TRE_CLI_SERVER_ADDRESS: address
      })
    })
    child.on('exit', code=>{
      // FIXME: when ssb-revisions.close()
      // is called on the first tuck, wrap  queues the method calls for seq==NaN
      // (wwhich never happens, so we hang forever)
      setTimeout( ()=>{
        ssb.close( err=>{
          if (err) console.error(err.message)
          process.exit(code)
        })
      }, 700) // get rid of the timeout
    })
  }
})
