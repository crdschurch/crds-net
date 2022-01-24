#!/bin/bash
# Substitute https://crds-online url to https://online.crossroads.net
crds_instances_old=$(grep -rl 'https://crds-online' _site | wc -l)
online_crossroads_instances_old=$(grep -rl 'https://online.crossroads.net' _site | wc -l)
grep -rl 'https://crds-online/' _site | xargs sed -i 's/https:\/\/crds-online\//https:\/\/online\.crossroads\.net\//g'
online_crossroads_instances_new=$(grep -rl 'https://online.crossroads.net' _site | wc -l)

echo "Making substitutions on $crds_instances_old files."
difference=$(( $online_crossroads_instances_new - $online_crossroads_instances_old ))
echo "$difference substitution(s) made"
echo "$OSTYPE"
