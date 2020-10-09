module.exports = bin =>
`USAGE

  ${require('./usage')(bin)}

DESCRIPTION

  ${bin} runs an ssb server configured for tre applications with ssb-revisions, ssb-sandboxed-views and tre-boot built-in.
  The configuration by default is read from a JSON file called .trerc in the current working directory. (see --config for details). Without the 'run' subcommand, the server will keep running until terminated. When 'run' is given, the specified shell commnd will be executed after the server is ready, and when the shell command terminates, the server is shut down again. Unlike other ssb servers, ${bin} will automatically pick available TCP ports if the ones specified in the config file are taken. 

  run SHELL_COMMAND    runs SHELL_COMMAND in a sub-shell and terminates when the sub-shell terminates
  --config CONFIG      path to JSON file with caps.shs, defaults to .trerc (see FILES)
  --help               show help

FILES
  
  If --config CONFIG is not given, ${bin} looks for a file named .trerc in the current directory or above. (and other locations, see rc on npm for details)

  When started, ${bin} writes its multiserver address into .tre/address

ENVIRONMENT

  If run SHELL_COMMAND is given, ${bin} sets TRE_CLI_SERVER_ADDRESS to the multiserver address in the environment of the sub shell

EXAMPLE

  ${bin} run "tre rpc messagesByType --type about"
`
