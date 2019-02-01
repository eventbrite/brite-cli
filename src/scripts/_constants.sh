#!/bin/sh

source _logger.sh
source _colors.sh

_VARS_BEFORE=$(compgen -v)

# Constants
# =========

CURRENT_DIRECTORY=$(pwd)
CURRENT_DIRECTORY_NAME=$(basename $CURRENT_DIRECTORY)

# Debug Helpers
# =============

# extracts constants created in this file so we can report them
_VARS_AFTER=$(compgen -v)
_VARS_ALL="$_VARS_BEFORE $_VARS_AFTER _VARS_BEFORE"
_VARS_DIFF=$(echo $_VARS_ALL | tr ' ' '\n' | sort | uniq -u)

_printvar() {
  if [[ $1 =~ ^(.*)=(.*)$ ]]; then
    name=${BASH_REMATCH[1]}
    value=${BASH_REMATCH[2]}
    DEBUG=true debug "  ${TEXT_GREEN}$name${TEXT_RESET}=${TEXT_MAGENTA}$value${TEXT_RESET}"
  else
    DEBUG=true debug "  $1"
  fi
}

_printconstants() {
  DEBUG=true debug "${TEXT_GREEN}constants:${TEXT_RESET}"
  for var in $_VARS_DIFF; do
    _printvar "$var=${!var}"
  done
}

_printenv() {
  DEBUG=true debug "${TEXT_GREEN}env:${TEXT_RESET}"
  vars=$(printenv | sort)
  for var in $vars; do
    _printvar $var
  done
}

_printall() {
  _printconstants
  _printenv
}
