#!/bin/bash
set -e

if [ $# -eq 0 ]
then
  echo "Please specify file to search"
else
  PATH_TO_FILE=$1
fi

if [ $# -eq 1 ]
then
  echo "Please specify argument containing string to search for."
else
  NEEDLE=$2
fi

if grep -Fq "$NEEDLE" $PATH_TO_FILE
then
  echo "\"${NEEDLE}\" is present in ${PATH_TO_FILE}"
  exit 0
else
  echo "\"${NEEDLE}\" not found in ${PATH_TO_FILE}"
  exit 1
fi
