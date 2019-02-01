#!/bin/sh

source _colors.sh
source _logger.sh

if [ "$_BRITE_FAILED_TASKS" = "" ]; then
  declare -a _BRITE_FAILED_TASKS=()
fi

# Run a command, formatting its logs, and saving its exit code
# ex: `task babel src -Dd dist`
task() {
  info "Task ${TEXT_CYAN}$1${TEXT_RESET} running..."

  # Remember the exit code
  _task_exit_code=0

  # Execute the commands and format the logs, if it fails, store the exit code
  exec $@ | _task_format_piped_logs $1 || _task_exit_code=$?

  # if the exit code is not still zero, save the failure
  if [ "$_task_exit_code" -eq 0 ]; then
    success "Task ${TEXT_CYAN}$1${TEXT_RESET} passed."
  else
    error "Task ${TEXT_CYAN}$1${TEXT_RESET} failed! (code: $_task_exit_code)"
    _BRITE_FAILED_TASKS+=($1)
  fi
}

# Format logs as they come in, wrap it with horizontal rules, but only if there
# are actually logs
_task_format_piped_logs() {
  _has_run=false
  while IFS= read -r _log_line; do
    if [ "$_has_run" = false ]; then
      horizontal_rule
      _has_run=true
    fi
    echo "${TEXT_CYAN}$1 >${TEXT_RESET} $_log_line"
  done
  if [ "$_has_run" = true ]; then
    insert_horizontal_rule
  fi
}
