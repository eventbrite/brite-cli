#!/bin/sh
set -e
set -o pipefail # TODO: Should we be using this?

# Only create these if the script has not been run yet.
if [ "$_BRITE_IS_RUNNING" = "" ]; then
  _BRITE_START_TIME=$(date +%s)
  _BRITE_IS_RUNNING=true
fi

source _colors.sh
source _constants.sh
source _logger.sh
source _task.sh

# Handler for when script finally exits
_on_exit_handler() {
  _BRITE_END_TIME=$(date +%s)
  _BRITE_TOTAL_TIME=$((_BRITE_END_TIME - _BRITE_START_TIME))

  insert_horizontal_rule

  # Report any failed tasks
  if [ -n "$_BRITE_FAILED_TASKS" ]; then
    error "The following tasks failed:"
    for task in $_BRITE_FAILED_TASKS; do
      log "- ${TEXT_RED}$task${TEXT_RESET}"
    done
    insert_horizontal_rule
  fi

  # Report time script took
  log "${TEXT_MAGENTA}Done in $((_BRITE_SCRIPT_TOTAL_TIME))s.${TEXT_RESET}"

  echo ""
  echo ""

  # Exit with 1 if any failed tasks
  if [ -n "$_BRITE_FAILED_TASKS" ]; then
    exit 1
  fi
}

# Internal setup
# ==============

# If this script has not been run yet, set everything up
if [ "$___BRITE_CLI_IS_RUNNING" = "" ]; then
  ___BRITE_CLI_IS_RUNNING=true

  # Add exit handler
  trap _on_exit_handler EXIT

  # Introduction:
  echo ""
  echo ""
  log "${TEXT_BOLD}${TEXT_MAGENTA_BG} Brite CLI ${TEXT_RESET}"
  insert_horizontal_rule
  if [ $DEBUG ]; then
    _printall
    insert_horizontal_rule
  fi
fi
