#!/bin/sh
source _base.sh

# If no arguments were passed, run on all possible files, otherwise run on just
# files passed
if [ $# -eq 0 ]; then
  task prettier --write '**/*.{js,ts,tsx,json,md,sass,scss}'
else
  task prettier --write $@
fi
