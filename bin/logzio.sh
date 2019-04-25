#!/bin/bash

curl -T buildlog.txt http://listener.logz.io:8021/file_upload/${LOGZIO_API_KEY}/crds-net
rm -rf buildlog.txt

exit 1
