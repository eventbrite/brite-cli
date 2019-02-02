#!/bin/sh
source _base.sh

task babel src -Dd dist ${@:2}
