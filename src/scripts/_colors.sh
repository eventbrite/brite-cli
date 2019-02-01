#!/bin/sh

# If in terminal, force Chalk to output color
# TODO: Make sure this doesn't run if in CI
if [ -t 1 ]; then
  export FORCE_COLOR=1
fi

# Ascii Color Codes for the Terminal
TEXT_BOLD="\033[1m"
TEXT_DIM="\033[2m"
TEXT_RED="\033[31m"
TEXT_RED="\033[31m"
TEXT_CYAN="\033[36m"
TEXT_GREEN="\033[32m"
TEXT_YELLOW="\033[33m"
TEXT_MAGENTA="\033[35m"
TEXT_MAGENTA_BG="\033[45m"
TEXT_RESET="\033[0m" # Always end with this
