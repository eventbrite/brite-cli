#!/bin/sh
source _base.sh

# If no arguments were passed, run on all possible files, otherwise run on just
# files passed
if [ $# -eq 0 ]; then
  task sass-lint '**/*.{sass,scss}'
else
  task sass-lint $@
fi
