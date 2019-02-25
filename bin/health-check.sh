#!/bin/bash
set -e
PATH_TO_FILE='./_site/index.html'

if [ $# -eq 0 ]
then
  echo "Please specify argument containing string to search for."
else
  NEEDLE=$1
fi

if grep -Fq "$NEEDLE" $PATH_TO_FILE
then
  exit 0
else
  echo "${NEEDLE} not found in ${PATH_TO_FILE}"
  exit 1
fi
