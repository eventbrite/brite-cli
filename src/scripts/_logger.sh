#!/bin/sh

source _colors.sh

# Logger
# =========

# Log helpers
# ex: `warning "Danger! Something happened"`

_LOG_PREFIX="       "
_INFO_PREFIX="${TEXT_MAGENTA}   info${TEXT_RESET}"
_SUCCESS_PREFIX="${TEXT_GREEN}success${TEXT_RESET}"
_WARNING_PREFIX="${TEXT_YELLOW}warning${TEXT_RESET}"
_ERROR_PREFIX="${TEXT_RED}  error${TEXT_RESET}"
_DEBUG_PREFIX="${TEXT_CYAN}  debug${TEXT_RESET}"

log() {
  echo "$_LOG_PREFIX $@"
}

info() {
  echo "$_INFO_PREFIX $@"
}

success() {
  echo "$_SUCCESS_PREFIX $@"
}

warning() {
  echo "$_WARNING_PREFIX $@"
}

error() {
  echo "$_ERROR_PREFIX $@"
}

debug() {
  if [ $DEBUG ]; then
    echo "$_DEBUG_PREFIX $@"
  fi
}

# Insert horizontal rule
# ex: `horizontal_rule`
insert_horizontal_rule() {
  local COLS=$(tput cols)
  COLS=$((COLS - 2))
  echo "${TEXT_DIM}$(printf '%*s\n' "${COLUMNS:-$COLS}" '' | tr ' ' ╴)${TEXT_RESET}"
}
